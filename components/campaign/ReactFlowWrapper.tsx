'use client';

import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import NodeSelectorDrawer from './NodeSelectorDrawer';
import { campaignWorkflowService } from '@/services/campaignWorkflowService';
const nodeTypes = {
  custom: CustomNode,
  action: CustomNode,
  condition: CustomNode,
  condition_branch: CustomNode,
};
interface ReactFlowWrapperProps {
  campaignId: string;
  onNodeClick?: (nodeId: string, nodeData: any) => void;
  setShowNodeSelector?: any
  showNodeSelector?: any
  campaignData?: any; // ✅ Receive campaign data from parent
  onCampaignDataRefresh?: () => Promise<void>; // ✅ Callback to refresh parent data
}

const ReactFlowWrapper: React.FC<ReactFlowWrapperProps> = ({
  setShowNodeSelector,
  showNodeSelector,
  campaignId,
  onNodeClick,
  campaignData, // ✅ Receive from parent
  onCampaignDataRefresh, // ✅ Callback to refresh parent


}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
 
  const [localSelectedNodeId, setLocalSelectedNodeId] = useState<string | null>("root");
  const [localBranch, setLocalBranch] = useState<string | null>("no_condition");

  const [replaceMode, setReplaceMode] = useState(false);
  const [replaceNodeId, setReplaceNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletedNodeIds, setDeletedNodeIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);







  const handleNodesChange = useCallback(
    async (changes: any) => {
      onNodesChange(changes);

      const positionChanges = changes.filter((change: any) => change.type === 'position' && change.position);

      for (const change of positionChanges) {
        try {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            // Update backend with new position
            await campaignWorkflowService.updateNode(change.id, {
              position_x: Math.round(change.position.x),
              position_y: Math.round(change.position.y)
            });
            console.log(`Position updated for node ${change.id}`, change.position);
          }
        } catch (error) {
          console.error(`Failed to update node ${change.id}`, error);
        }
      }
    },
    [onNodesChange, nodes]
  );


  // ✅ REMOVED: fetchWorkflowData - Now using campaignData from parent
  
  // ✅ Load nodes and edges from campaignData prop
  useEffect(() => {
    if (!campaignData) return;

    const fetchedNodes = campaignData.nodes || campaignData.data?.nodes || [];
    const fetchedEdges = campaignData.edges || campaignData.data?.edges || [];

    if (fetchedNodes && fetchedNodes.length > 0) {
      console.log("Loading nodes from campaignData:", fetchedNodes);
      console.log("Loading edges from campaignData:", fetchedEdges);

      const flowNodes = fetchedNodes.map((node: any) => ({
        id: node.id,
        type: "custom",
        position: {
          x: node.position?.x || 250,
          y: node.position?.y || 100
        },
        data: {
          label: node.data?.label || node.label || getNodeLabel(node.action_key || node.type),
          iconType: node.data?.iconType || node.action_key || node.type,
          action_key: node.data.action_key,
          subtitle: node.data?.subtitle || getNodeSubtitle(node.action_key || node.type),
          isCondition: ["condition_has_email", "condition_open_email", "condition_email_verified", "condition_has_phone_number", "condition_accepted_invite"].includes(node.data.action_key) || false,
          hasYesBranch: false,
          hasNoBranch: false,
          onPlusClick: () => handlePlusClick(node.id),
          onYesClick: ["condition_has_email", "condition_open_email", "condition_email_verified", "condition_has_phone_number", "condition_accepted_invite"].includes(node.data.action_key) ? () => handlePlusClick(node.id, 'yes') : undefined,
          onNoClick: node.data.action_key?.startsWith('condition_') ? () => handlePlusClick(node.id, 'no') : undefined,
          onYesDrop: undefined,
          onNoDrop: undefined,
          onReplaceClick: () => handleReplaceClick(node.id),
          onDeleteClick: () => handleDeleteNode(node.id),
          onWaitTimeChange: (nodeId: string, waitTimeInMinutes: number) => handleWaitTimeChange(nodeId, waitTimeInMinutes),
          onNodeClick: () => onNodeClick?.(node.id, { iconType: node.action_key || node.type }),
          sourceId: undefined,
        },
      }));

      const flowEdges = fetchedEdges.map((edge: any) => ({
        id: edge.id || `e${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || (edge.label === 'yes' ? 'yes' : (edge.label === 'no' ? 'no' : undefined)),
        type: "smoothstep",
        animated: true,
        label: edge.label || undefined,
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#fff', stroke: '#ccc', strokeWidth: 1 },
        labelStyle: { fill: edge.label === 'yes' ? '#22C55E' : (edge.label === 'no' ? '#EF4444' : '#6B7280'), fontWeight: 600 },
        style: { stroke: edge.label === 'yes' ? '#22C55E' : (edge.label === 'no' ? '#EF4444' : '#6B7280'), strokeWidth: 2 },
      }));

      setNodes(flowNodes as any);
      setEdges(flowEdges as any);
    }
  }, [campaignData]); // ✅ Re-run when campaignData changes

  // Create handleWaitTimeChange after data is loaded (like frontend_old)
  const handleWaitTimeChange = (nodeId: string, waitTimeInMinutes: number) => {
 
    // setNodes((prevNodes) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            wait_time: waitTimeInMinutes,
            subtitle: `Wait for ${waitTimeInMinutes} day${waitTimeInMinutes > 1 ? 's' : ''}`,
          },
        };
      }
      return node;
    });
 
    saveWorkflowData(updatedNodes, edges);
   
  };

  // ✅ REMOVED: useEffect that called fetchWorkflowData - now using campaignData prop

  // API Integration Functions


  const saveWorkflowData = useCallback(async (nodesToSave = nodes, edgesToSave = edges) => {


    if (!campaignId) return;
    console.log("edgesToSave", edgesToSave);



    setIsSaving(true);
    setError(null);
    try {
      await campaignWorkflowService.saveCampaignFlow({
        campaignId,
        nodes: nodesToSave,
        edges: edgesToSave
      });
      setDeletedNodeIds([]);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      // ✅ Call parent refresh callback instead of fetching data here
      if (onCampaignDataRefresh) {
        await onCampaignDataRefresh();
      }
    } catch (error: any) {
      console.error('Error saving workflow:', error);
      setError(error.message || 'Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  }, [campaignId, nodes, edges, deletedNodeIds, onCampaignDataRefresh]); // ✅ Updated dependency







  const handlePlusClick = (sourceId: string, branch?: 'yes' | 'no') => {
    setShowNodeSelector(true);
    setLocalSelectedNodeId(sourceId);
    // Store branch info for when adding new nodes
    if (branch) {
      setLocalBranch(branch)
    } else {
      setLocalBranch("no_condition")
    }
  };


  const handleReplaceClick = (nodeId: string) => {
    setReplaceMode(true);
    setReplaceNodeId(nodeId);
    setShowNodeSelector(true);
  };




  const handleDeleteNode = useCallback(async (nodeId: string) => {
    // Show confirmation dialog


    const confirmed = window.confirm('Are you sure you want to delete this node? This action cannot be undone.');
    if (!confirmed) return;

    const nodeToDelete = nodes.find((node) => node.id === nodeId);
    if (!nodeToDelete) return;

    const conditionKeys = [
      'condition_open_message',
      'condition_accepted_invite',
      'condition_has_email',
      'condition_has_phone_number',
      'condition_link_clicked',
      'condition_is_email_verified',
    ];

    const isConditionNode =
      nodeToDelete.data?.isCondition || conditionKeys.includes(nodeToDelete.data?.action_key);

    // Helper: Recursively collect all descendant node IDs
    const getAllDescendants = (parentId: string): string[] => {
      let result: string[] = [];
      const directChildren = edges
        .filter((e) => e.source === parentId)
        .map((e) => e.target);

      for (const childId of directChildren) {
        result.push(childId);
        result = result.concat(getAllDescendants(childId)); // Recursive
      }

      return result;
    };

    try {
      setIsLoading(true);
      setError(null);

      if (isConditionNode) {
        // For condition nodes: Delete all descendants locally
        const allDescendants = getAllDescendants(nodeId);
        const allToDelete = [nodeId, ...allDescendants];

        const updatedNodes = nodes.filter((n) => !allToDelete.includes(n.id));
        const updatedEdges = edges.filter(
          (e) => !allToDelete.includes(e.source) && !allToDelete.includes(e.target)
        );

        const combinedDeleted = [...deletedNodeIds, ...allToDelete];
        setDeletedNodeIds(combinedDeleted);
        setNodes(updatedNodes);
        setEdges(updatedEdges);

        // Save the changes
        saveWorkflowData(updatedNodes, updatedEdges);
      } else {
        console.log("badjkchjk", nodeId);
        // For regular nodes: Call API to delete
        const response = await campaignWorkflowService.deleteNode(nodeId);

        // Check if deletion was successful
        if (!response.status) {
          const message = response.message || 'This node cannot be deleted because it has child nodes or is a protected node type.';
          setError(message);
          setIsLoading(false);
          return;
        }

        // ✅ Refresh data after successful deletion using parent callback
        if (onCampaignDataRefresh) {
          await onCampaignDataRefresh();
        }
      }
    } catch (error: any) {
      console.error('Error deleting node:', error);
      setError(error.message || 'Failed to delete node. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [nodes, edges, deletedNodeIds, saveWorkflowData, onCampaignDataRefresh]); // ✅ Updated dependency







  const handleAddNode = async (nodeType: string) => {
    console.log("localSelectedNodeId", localSelectedNodeId);

    if (!localSelectedNodeId && !replaceMode) return;
    console.log("nodeType---------", nodeType, replaceNodeId);

    if (replaceMode && replaceNodeId) {
      // Call backend API for replace
      campaignWorkflowService.replaceNode(replaceNodeId, {
        iconType: nodeType,
        action_key: nodeType,
        //  menuIcon:
        //   iconType !== "yes" && iconType !== "no" && iconType !== "plus"
        //     ? "bi bi-three-dots-vertical"
        //     : "",
        label: getNodeLabel(nodeType),
        subtitle: getNodeSubtitle(nodeType),
        wait_time: nodeType === 'wait' ? 1440 : 0

      }).then(async () => {
        // Close selector and reset state
        setShowNodeSelector(false);
        setReplaceMode(false);
        setReplaceNodeId(null);

        // ✅ Refresh data from parent callback
        if (onCampaignDataRefresh) {
          await onCampaignDataRefresh();
        }
      }).catch((error) => {
        console.error('Error replacing node:', error);
        setError('Failed to replace node');
      });
      return;
    }

    // Strict rule: Only allow adding nodes if there's a valid connection point
    if (localSelectedNodeId === 'root' && nodes.length === 0) {


    } else if (localSelectedNodeId === 'root' && nodes.length > 0) {
      // Prevent adding isolated root nodes
      console.log("222");

      alert('⚠️ Connection Required\n\nAll nodes must be connected to existing nodes. Please add nodes by clicking the "+" button on existing nodes or dragging them to connection points.');
      return;
    }

    setIsLoading(true);

    // Adding new node - prepare data for backend
    const sourceNode = nodes.find((n: any) => n.id === localSelectedNodeId);
    console.log("sourceNode----", sourceNode);

    // Calculate position
    const position = sourceNode
      ? {
        x: sourceNode.position?.x || 250,
        y: (sourceNode.position?.y || 100) + 150
      }
      : { x: 250, y: 400 };

    // Create new node data
    const newNode = {
      id: uuidv4(),
      type: "custom",
      position,
       action_key: nodeType,
      data: {
        label: getNodeLabel(nodeType),
        iconType: nodeType,
        action_key: nodeType,
        subtitle: getNodeSubtitle(nodeType),
        isCondition: nodeType.startsWith('condition_'),
        wait_time: nodeType === 'wait' ? 1440 : 0,
        duration: nodeType === 'wait' ? undefined : 1,
      }
    };
    // const updates = (sourceNode?.data?.label === "+" && isCondition) ? [] : [newNode];
    // Create new edge if not adding as root
    if (localBranch == "no_condition" || localBranch == "yes" || localBranch == "no") {
      const newEdge = localSelectedNodeId !== 'root' ? {
        id: `e${localSelectedNodeId}-${newNode.id}`,
        source: localSelectedNodeId,
        target: newNode.id,
        sourceHandle: localBranch,
        type: 'smoothstep',
        animated: true,
        label: localBranch != "no_condition" ? localBranch : " ",
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#fff', stroke: '#ccc', strokeWidth: 1 },
        labelStyle: { fill: localSelectedNodeId?.includes('-yes') ? '#22C55E' : (localSelectedNodeId?.includes('-no') ? '#EF4444' : '#6B7280'), fontWeight: 600 },
        style: { stroke: localSelectedNodeId?.includes('-yes') ? '#22C55E' : (localSelectedNodeId?.includes('-no') ? '#EF4444' : '#6B7280'), strokeWidth: 2 }
      } : null;

      // Prepare updated nodes and edges for save-flow API
      const updatedNodes = [...nodes, newNode];

      const updatedEdges = newEdge ? [...edges, newEdge] : edges;

      await saveWorkflowData(updatedNodes, updatedEdges)
      console.log("lplplpl----------");

    }



  };

  const getNodeLabel = (nodeType: string): string => {
    const labelMap: Record<string, string> = {
      'action_send_email': 'Send Email',
      'action_send_message': 'Chat Message',
      'action_ai_voice_message': 'Voice Message',
      'action_create_task': 'Create Task',
      'action_visit_profile': 'Visit Profile',
      'action_invitation': 'Invitations',
      'condition_open_email': 'If Email Opened',
      'condition_has_email': 'Has Email',
      'condition_accepted_invite': 'If Connected',
    };
    return labelMap[nodeType] || nodeType;
  };

  const getNodeSubtitle = (nodeType: string): string => {
    const subtitleMap: Record<string, string> = {
      'action_send_email': 'on Gmail',
      'action_send_message': 'Send on LinkedIn',
      'action_ai_voice_message': 'on LinkedIn',
      'action_create_task': 'on LinkedIn',
      'action_linkedin_like': 'on LinkedIn',
      'action_call': 'Create task',
      'action_invitation': 'on LinkedIn',
      'action_visit_profile': 'Visit Profile',
      'condition_custom': '',
      'condition_has_email': '',
      'condition_email_not_accepted': '',
      'condition_reach_goal': '',
      'condition_accepted_invite': '',
      'condition_open_email': '',
      'condition_email_verified': '',
      'condition_has_phone_number': '',
      'condition_email_link_clicked': '',
      'wait': '2 days',
      'condition_end_sequence': '',
      'condition_open_linkedin_message': '',
    };
    return subtitleMap[nodeType] || '';
  };

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => [...eds, { ...params, animated: true }] as any),
    [setEdges]
  );

  const enhancedNodes = nodes.map((node) => {
    const hasChild = edges.some((edge) => edge.source === node.id);
    return {
      ...node,
      data: {
        ...node.data,
        onPlusClick: () => handlePlusClick(node.id),
        onDeleteClick: () => handleDeleteNode(node.id),
        onReplaceClick: () => handleReplaceClick(node.id),
        onWaitTimeChange: handleWaitTimeChange, // ← Direct function reference

        hasChild,
      },
    };
  });


  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}

        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-100 to-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Building Your Workflow</h3>
            <p className="text-gray-600 mb-4">
              Drag nodes from the sidebar or click "Add New Step" to begin creating your campaign workflow.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>💡</span>
              <span>Tip: Try dragging a "Send Email" node to get started</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
              <span className="text-gray-700 font-medium">Loading workflow...</span>
            </div>
          </div>
        </div>
      )}

      {/* Saving Indicator */}
      {isSaving && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
              <span className="text-gray-700 text-sm font-medium">Saving...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Indicator */}
      {error && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-3 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Indicator */}
      {lastSaved && !isSaving && !error && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-green-700 text-sm font-medium">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Save Button */}
      {hasUnsavedChanges && !isSaving && (
        <div className="absolute top-4 right-4 z-10">
          <button
            // onClick={() => saveWorkflowData(undefined, undefined, undefined, true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Node Selector Drawer */}
      <NodeSelectorDrawer
        isOpen={showNodeSelector}
        onClose={() => {
          setShowNodeSelector(false);
          setReplaceMode(false);
          setReplaceNodeId(null);
        }}
        onSelectNode={handleAddNode}
        isReplaceMode={replaceMode}
      />
    </div>
  );
};

export default ReactFlowWrapper;
