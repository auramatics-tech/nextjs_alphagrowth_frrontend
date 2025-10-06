'use client';

import React, { useCallback, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
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

// Define the ref interface
export interface ReactFlowWrapperRef {
  openNodeSelectorForRoot: () => void;
}

interface ReactFlowWrapperProps {
  campaignId: string;
  onNodeClick: (nodeId: string, nodeData: any) => void;
  setSelectedNodeId: (node: { id: string; type: string } | null) => void;
  onDurationChange?: (nodeId: string, durationInDays: number) => void;
}

// Wrap the component with forwardRef
const ReactFlowWrapper = forwardRef<ReactFlowWrapperRef, ReactFlowWrapperProps>(
  function ReactFlowWrapper({ campaignId, onNodeClick, setSelectedNodeId: setSelectedNodeIdProp, onDurationChange: onDurationChangeProp }, ref) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [showNodeSelector, setShowNodeSelector] = useState(false);
    const [localSelectedNodeId, setLocalSelectedNodeId] = useState<string | null>(null);
    const [replaceMode, setReplaceMode] = useState(false);
    const [replaceNodeId, setReplaceNodeId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deletedNodeIds, setDeletedNodeIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSavedTree, setLastSavedTree] = useState<string | null>(null);

    // Expose function via ref
    useImperativeHandle(ref, () => ({
      openNodeSelectorForRoot: () => {
        setLocalSelectedNodeId('root'); // Special ID for root
        setShowNodeSelector(true);
        setReplaceMode(false); // Ensure not in replace mode
        setReplaceNodeId(null);
      },
    }));

    // Tree-based workflow structure - starts empty
    const [workflowTree, setWorkflowTree] = useState<any>({
      id: 'root',
      children: []
    });

    // API Integration Functions
    const fetchWorkflowData = useCallback(async () => {
      if (!campaignId) return;

      setIsLoading(true);
      setError(null);
      try {
        const flowData = await campaignWorkflowService.getCampaignFlow(campaignId);
        const { nodes: fetchedNodes, edges: fetchedEdges } = flowData;

        if (fetchedNodes && fetchedNodes.length > 0) {
          // Convert backend data to tree structure
          const treeData = convertBackendToTree(fetchedNodes, fetchedEdges);
          setWorkflowTree(treeData);
        }
      } catch (error: any) {
        console.error('Error fetching workflow data:', error);
        setError(error.message || 'Failed to load workflow data');
      } finally {
        setIsLoading(false);
      }
    }, [campaignId]);

    const saveWorkflowData = useCallback(async (nodesToSave = nodes, edgesToSave = edges, deletedIds = deletedNodeIds, forceSave = false) => {
      if (!campaignId) return;

      // Check if there are actual changes to save
      const currentTreeString = JSON.stringify(workflowTree);
      if (!forceSave && lastSavedTree === currentTreeString) {
        return; // No changes to save
      }

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
        setLastSavedTree(currentTreeString);
      } catch (error: any) {
        console.error('Error saving workflow:', error);
        setError(error.message || 'Failed to save workflow');
      } finally {
        setIsSaving(false);
      }
    }, [campaignId, nodes, edges, deletedNodeIds, workflowTree, lastSavedTree]);

    // Convert backend nodes/edges to tree structure
    const convertBackendToTree = (backendNodes: any[], backendEdges: any[]) => {
      const nodeMap = new Map();
      const rootNodes: any[] = [];

      // Create node map
      backendNodes.forEach(node => {
        nodeMap.set(node.id, {
          id: node.id,
          type: node.data?.iconType || node.action_key,
          label: node.data?.label || node.label,
          subtitle: node.data?.subtitle || '',
          isCondition: node.data?.isCondition || false,
          wait_time: node.data?.wait_time,
          duration: node.data?.duration,
          children: [],
          yesPath: [],
          noPath: []
        });
      });

      // Build tree structure
      backendEdges.forEach(edge => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);

        if (sourceNode && targetNode) {
          if (edge.label === 'Yes') {
            sourceNode.yesPath.push(targetNode);
          } else if (edge.label === 'No') {
            sourceNode.noPath.push(targetNode);
          } else {
            sourceNode.children.push(targetNode);
          }
        }
      });

      // Find root nodes (nodes with no incoming edges)
      const hasIncomingEdge = new Set(backendEdges.map(edge => edge.target));
      backendNodes.forEach(node => {
        if (!hasIncomingEdge.has(node.id)) {
          const treeNode = nodeMap.get(node.id);
          if (treeNode) {
            rootNodes.push(treeNode);
          }
        }
      });

      return {
        id: 'root',
        children: rootNodes
      };
    };

    // Load workflow data on component mount
    useEffect(() => {
      fetchWorkflowData();
    }, [fetchWorkflowData]);

    // Track changes to workflow tree
    useEffect(() => {
      const currentTreeString = JSON.stringify(workflowTree);
      if (lastSavedTree && lastSavedTree !== currentTreeString) {
        setHasUnsavedChanges(true);
      }
    }, [workflowTree, lastSavedTree]);

    // Auto-save functionality with proper debouncing
    useEffect(() => {
      // Only auto-save if there are unsaved changes and we're not already saving
      if (!hasUnsavedChanges || isSaving || nodes.length === 0) return;

      const autoSaveTimeout = setTimeout(() => {
        // Double-check conditions before saving
        if (hasUnsavedChanges && !isSaving && nodes.length > 0) {
          saveWorkflowData();
        }
      }, 5000); // Increased to 5 seconds to reduce API calls

      return () => clearTimeout(autoSaveTimeout);
    }, [hasUnsavedChanges, isSaving, nodes.length, saveWorkflowData]);

    // Convert tree to React Flow nodes and edges
    const convertTreeToFlow = (tree: any) => {
      const nodes: any[] = [];
      const edges: any[] = [];
      const nodeWidth = 200;
      const nodeHeight = 80;

      // Calculate total node count for dynamic spacing
      const countNodes = (nodes: any[]): number => {
        let count = nodes.length;
        nodes.forEach(node => {
          if (node.children) count += countNodes(node.children);
          if (node.yesPath) count += countNodes(node.yesPath);
          if (node.noPath) count += countNodes(node.noPath);
        });
        return count;
      };

      const totalNodes = countNodes(tree.children);
      const verticalSpacing = Math.max(200, 150 + (totalNodes * 8));  // Increased dynamic spacing
      const horizontalSpacing = Math.max(300, 200 + (totalNodes * 15)); // Increased dynamic spacing

      // This map will store the maximum Y position reached by any node in a given branch,
      // keyed by the parent node's ID and branch type ('yes', 'no', 'child').
      // This helps in stacking nodes vertically within a branch.
      const branchMaxY: { [key: string]: number } = {};

      // Anti-overlap system: Track all placed nodes to prevent overlaps
      const placedNodes: Array<{ id: string; x: number; y: number; width: number; height: number }> = [];

      // Visual feedback for overlap detection
      const addOverlapWarning = (nodeId: string) => {
        // Node position adjusted to prevent overlap
      };

      // Function to check if a position would overlap with existing nodes
      const checkOverlap = (newX: number, newY: number, nodeWidth: number, nodeHeight: number): boolean => {
        const margin = 20; // Minimum margin between nodes

        for (const existingNode of placedNodes) {
          const horizontalOverlap = Math.abs(newX - existingNode.x) < (nodeWidth + existingNode.width) / 2 + margin;
          const verticalOverlap = Math.abs(newY - existingNode.y) < (nodeHeight + existingNode.height) / 2 + margin;

          if (horizontalOverlap && verticalOverlap) {
            return true;
          }
        }
        return false;
      };

      // Function to find a non-overlapping position
      const findNonOverlappingPosition = (preferredX: number, preferredY: number, nodeWidth: number, nodeHeight: number) => {
        let testX = preferredX;
        let testY = preferredY;
        let attempts = 0;
        const maxAttempts = 50;

        // Try the preferred position first
        if (!checkOverlap(testX, testY, nodeWidth, nodeHeight)) {
          return { x: testX, y: testY };
        }

        // Find alternative position due to overlap

        // If preferred position overlaps, try to find a nearby position
        while (attempts < maxAttempts) {
          // Try positions in a spiral pattern around the preferred position
          const radius = Math.floor(attempts / 4) + 1;
          const angle = (attempts % 4) * (Math.PI / 2);

          testX = preferredX + Math.cos(angle) * radius * horizontalSpacing;
          testY = preferredY + Math.sin(angle) * radius * verticalSpacing;

          if (!checkOverlap(testX, testY, nodeWidth, nodeHeight)) {
            return { x: testX, y: testY };
          }

          attempts++;
        }

        // If we still can't find a position, use a fallback with large spacing
        const fallbackX = preferredX + (placedNodes.length * horizontalSpacing);
        const fallbackY = preferredY + (placedNodes.length * verticalSpacing);
        return { x: fallbackX, y: fallbackY };
      };

      // Function to recursively process nodes and calculate positions
      // It returns the maximum Y coordinate reached by the subtree rooted at 'node'
      const processNode = (node: any, parentFlow_Node: any | null, branchType: 'yes' | 'no' | 'child' | 'root', siblingIndex: number, totalSiblings: number): number => {
        const nodeId = node.id;
        const isCondition = node.isCondition;
        const flowNodeType = 'custom';

        let x = 0;
        let y = 0;
        let currentMaxY = 0;

        if (!parentFlow_Node) { // Root node
          y = 100 + siblingIndex * (nodeHeight + verticalSpacing); // Position based on its index in root children
          // Distribute root nodes horizontally if there are multiple
          let preferredX = 250; // Default centered position
          if (totalSiblings > 1) {
            preferredX = 250 + (siblingIndex - (totalSiblings - 1) / 2) * (nodeWidth + 100);
          }

          // Use anti-overlap system for root nodes too
          const nonOverlappingPos = findNonOverlappingPosition(preferredX, y, nodeWidth, nodeHeight);
          x = nonOverlappingPos.x;
          y = nonOverlappingPos.y;
        } else { // Child node
          const parentY = parentFlow_Node.position.y;
          const parentX = parentFlow_Node.position.x;

          // Determine the key for branchMaxY to track vertical stacking within a branch
          const branchKey = `${parentFlow_Node.id}-${branchType}`;
          // Start Y for this node: either below the parent, or below the last node in this specific branch
          let startYForBranch = branchMaxY[branchKey] || (parentY + nodeHeight + verticalSpacing);

          y = startYForBranch;

          // Calculate preferred position first
          let preferredX = parentX;
          if (isCondition) {
            preferredX = parentX; // Condition nodes are centered below parent
          } else if (branchType === 'yes') {
            preferredX = parentX - horizontalSpacing; // Yes branch to the left
          } else if (branchType === 'no') {
            preferredX = parentX + horizontalSpacing; // No branch to the right
          } else { // Regular child (non-condition, non-branch)
            preferredX = parentX; // Default to parent's X
          }

          // Use anti-overlap system to find non-overlapping position
          const nonOverlappingPos = findNonOverlappingPosition(preferredX, y, nodeWidth, nodeHeight);
          x = nonOverlappingPos.x;
          y = nonOverlappingPos.y;

          // Ensure minimum spacing to prevent overlaps
          const minSpacing = nodeWidth + 50;
          if (branchType === 'yes' && Math.abs(x - parentX) < minSpacing) {
            x = parentX - minSpacing;
          } else if (branchType === 'no' && Math.abs(x - parentX) < minSpacing) {
            x = parentX + minSpacing;
          }

          // Update max Y for this branch for the next sibling/child
          branchMaxY[branchKey] = y + nodeHeight + verticalSpacing;
        }

        const newFlow_Node = {
          id: nodeId,
          type: flowNodeType,
          position: { x, y },
          data: {
            label: node.label,
            iconType: node.type,
            action_key: node.type,
            subtitle: node.subtitle,
            isCondition: isCondition,
            hasYesBranch: isCondition ? (node.yesPath && node.yesPath.length > 0) : false,
            hasNoBranch: isCondition ? (node.noPath && node.noPath.length > 0) : false,
            onPlusClick: () => handlePlusClick(nodeId),
            onYesClick: isCondition ? () => handlePlusClick(nodeId, 'yes') : undefined,
            onNoClick: isCondition ? () => handlePlusClick(nodeId, 'no') : undefined,
            onYesDrop: isCondition ? (nodeType: string) => handleDirectDrop(nodeId, nodeType, 'yes') : undefined,
            onNoDrop: isCondition ? (nodeType: string) => handleDirectDrop(nodeId, nodeType, 'no') : undefined,
            onReplaceClick: () => handleReplaceClick(nodeId),
            onDeleteClick: () => handleDeleteNode(nodeId),
            onNodeClick: () => onNodeClick(nodeId, { iconType: node.type }),
            onWaitTimeChange: (nodeId: string, waitTimeInMinutes: number) => handleWaitTimeChange(nodeId, waitTimeInMinutes),
            onDurationChange: (nodeId: string, durationInDays: number) => handleDurationChange(nodeId, durationInDays),
            onNodeDragOver: (event: React.DragEvent, nodeId: string) => onNodeDragOver(event, nodeId),
            onNodeDrop: (event: React.DragEvent, nodeId: string) => onNodeDrop(event, nodeId),
            sourceId: parentFlow_Node ? parentFlow_Node.id : undefined,
          },
        };
        nodes.push(newFlow_Node);

        // Add to placedNodes array to prevent future overlaps
        placedNodes.push({
          id: nodeId,
          x: x,
          y: y,
          width: nodeWidth,
          height: nodeHeight
        });

        currentMaxY = y + nodeHeight; // Initial max Y for this node

        if (parentFlow_Node) {
          // Create edge with proper source handle for conditional branches
          const sourceHandle = branchType === 'yes' ? 'yes' : (branchType === 'no' ? 'no' : undefined);
          edges.push({
            id: `e${parentFlow_Node.id}-${nodeId}`,
            source: parentFlow_Node.id,
            target: nodeId,
            sourceHandle: sourceHandle,
            type: 'smoothstep',
            animated: true,
            label: (branchType === 'yes' ? 'Yes' : (branchType === 'no' ? 'No' : undefined)),
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: { fill: '#fff', stroke: '#ccc', strokeWidth: 1 },
            labelStyle: { fill: branchType === 'yes' ? '#22C55E' : (branchType === 'no' ? '#EF4444' : '#6B7280'), fontWeight: 600 },
            style: { stroke: branchType === 'yes' ? '#22C55E' : (branchType === 'no' ? '#EF4444' : '#6B7280'), strokeWidth: 2 },
          });
        }

        let childrenMaxY = y; // Track max Y of children for this node

        // Recursively process children, passing the newly created flow node as the parent
        if (node.children && node.children.length > 0) {
          let previousChildNode: any = null;
          node.children.forEach((child: any, idx: number) => {
            const childMaxY = processNode(child, newFlow_Node, 'child', idx, node.children.length);
            childrenMaxY = Math.max(childrenMaxY, childMaxY);

            // Connect to previous child in the same path
            if (previousChildNode) {
              edges.push({
                id: `e${previousChildNode.id}-${child.id}`,
                source: previousChildNode.id,
                target: child.id,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#6B7280', strokeWidth: 2 },
              });
            }
            previousChildNode = { id: child.id };
          });
        }

        let yesPathMaxY = y;
        if (node.yesPath && node.yesPath.length > 0) {
          let previousChildNode: any = null;
          node.yesPath.forEach((child: any, idx: number) => {
            const childMaxY = processNode(child, newFlow_Node, 'yes', idx, node.yesPath.length);
            yesPathMaxY = Math.max(yesPathMaxY, childMaxY);

            // Connect to previous child in the same path
            if (previousChildNode) {
              edges.push({
                id: `e${previousChildNode.id}-${child.id}`,
                source: previousChildNode.id,
                target: child.id,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#22C55E', strokeWidth: 2 },
              });
            }
            previousChildNode = { id: child.id };
          });
        }

        let noPathMaxY = y;
        if (node.noPath && node.noPath.length > 0) {
          let previousChildNode: any = null;
          node.noPath.forEach((child: any, idx: number) => {
            const childMaxY = processNode(child, newFlow_Node, 'no', idx, node.noPath.length);
            noPathMaxY = Math.max(noPathMaxY, childMaxY);

            // Connect to previous child in the same path
            if (previousChildNode) {
              edges.push({
                id: `e${previousChildNode.id}-${child.id}`,
                source: previousChildNode.id,
                target: child.id,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#EF4444', strokeWidth: 2 },
              });
            }
            previousChildNode = { id: child.id };
          });
        }

        // The max Y for this node's subtree is the max of its own Y and all its children's max Ys
        currentMaxY = Math.max(currentMaxY, childrenMaxY, yesPathMaxY, noPathMaxY);

        // Update branchMaxY for the parent, if this node is part of a branch
        if (parentFlow_Node && branchType !== 'root') {
          const parentBranchKey = `${parentFlow_Node.id}-${branchType}`;
          branchMaxY[parentBranchKey] = Math.max(branchMaxY[parentBranchKey] || 0, currentMaxY + verticalSpacing);
        }

        return currentMaxY; // Return the max Y reached by this subtree
      };

      let overallMaxY = 0;
      tree.children.forEach((rootNode: any, idx: number) => {
        const rootNodeMaxY = processNode(rootNode, null, 'root', idx, tree.children.length);
        overallMaxY = Math.max(overallMaxY, rootNodeMaxY);
      });

      // Anti-overlap system summary
      // Successfully placed nodes without overlaps

      return { nodes, edges };
    };

    // Initialize React Flow with tree data
    useEffect(() => {
      const { nodes, edges } = convertTreeToFlow(workflowTree);
      setNodes(nodes as any);
      setEdges(edges as any);
    }, [workflowTree]);

    const handlePlusClick = (sourceId: string, branch?: 'yes' | 'no') => {
      setLocalSelectedNodeId(sourceId);
      setShowNodeSelector(true);
      // Store branch info for when adding new nodes
      if (branch) {
        setLocalSelectedNodeId(`${sourceId}-${branch}`);
      } else {
        // Check if the node is in a Yes/No branch and maintain that context
        const findNodeBranch = (nodes: any[], targetId: string, currentBranch?: string): string | null => {
          for (const node of nodes) {
            if (node.id === targetId) {
              return currentBranch || null;
            }
            if (node.children) {
              const childBranch = findNodeBranch(node.children, targetId, currentBranch);
              if (childBranch !== null) return childBranch;
            }
            if (node.yesPath) {
              const yesBranch = findNodeBranch(node.yesPath, targetId, 'yes');
              if (yesBranch !== null) return yesBranch;
            }
            if (node.noPath) {
              const noBranch = findNodeBranch(node.noPath, targetId, 'no');
              if (noBranch !== null) return noBranch;
            }
          }
          return null;
        };

        const nodeBranch = findNodeBranch(workflowTree.children, sourceId);
        if (nodeBranch) {
          setLocalSelectedNodeId(`${sourceId}-${nodeBranch}`);
        }
      }
    };

    const handleDirectDrop = (targetNodeId: string, nodeType: string, branch: 'yes' | 'no') => {
      const newNodeId = uuidv4();
      const newNode = {
        id: newNodeId,
        type: nodeType,
        label: getNodeLabel(nodeType),
        subtitle: getNodeSubtitle(nodeType),
        isCondition: nodeType.startsWith('condition_'),
        position: { x: 250, y: 400 },
        children: [],
        yesPath: nodeType.startsWith('condition_') ? [] : undefined,
        noPath: nodeType.startsWith('condition_') ? [] : undefined,
        duration: nodeType === 'wait' ? undefined : 1, // Default duration of 1 day for non-wait nodes
        wait_time: nodeType === 'wait' ? 1440 : undefined, // Default wait time of 1 day in minutes for wait nodes
      };

      // Update the workflow tree
      setWorkflowTree((prevTree: any) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));

        const addNodeToBranch = (nodes: any[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            // Check if this is the target node
            if (node.id === targetNodeId) {
              if (branch === 'yes') {
                // Add to Yes path
                node.yesPath = node.yesPath || [];
                node.yesPath.push(newNode);
              } else if (branch === 'no') {
                // Add to No path
                node.noPath = node.noPath || [];
                node.noPath.push(newNode);
              }
              return true;
            }

            // Recursively search in children and paths
            if (node.children && addNodeToBranch(node.children)) return true;
            if (node.yesPath && addNodeToBranch(node.yesPath)) return true;
            if (node.noPath && addNodeToBranch(node.noPath)) return true;
          }
          return false;
        };

        addNodeToBranch(newTree.children);
        return newTree;
      });
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

      try {
        // Show loading state
        setIsLoading(true);
        setError(null);

        // Call backend API to delete node
        const response = await campaignWorkflowService.deleteNode(nodeId);

        // Check if deletion was successful
        if (!response.status) {
          // If backend returns false, it means the node cannot be deleted
          // (e.g., certain condition nodes that have child nodes)
          const message = response.message || 'This node cannot be deleted because it has child nodes or is a protected node type.';
          setError(message);
          setIsLoading(false);
          return;
        }

        // Update tree structure first
        setWorkflowTree((prevTree: any) => {
          const newTree = JSON.parse(JSON.stringify(prevTree));

          const removeNodeFromTree = (nodes: any[]): boolean => {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id === nodeId) {
                nodes.splice(i, 1);
                return true;
              }
              if (nodes[i].children && removeNodeFromTree(nodes[i].children)) return true;
              if (nodes[i].yesPath && removeNodeFromTree(nodes[i].yesPath)) return true;
              if (nodes[i].noPath && removeNodeFromTree(nodes[i].noPath)) return true;
            }
            return false;
          };

          removeNodeFromTree(newTree.children);
          return newTree;
        });

        // Force save after delete operation
        setTimeout(() => {
          saveWorkflowData(undefined, undefined, undefined, true);
          setIsLoading(false);
        }, 100);
      } catch (error: any) {
        console.error('Error deleting node:', error);
        setIsLoading(false);
        setError(error.message || 'Failed to delete node. Please try again.');
      }
    }, [saveWorkflowData]);

    const handleWaitTimeChange = useCallback((nodeId: string, waitTimeInMinutes: number) => {
      // Update the workflow tree with the new wait time
      setWorkflowTree((prevTree: any) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));

        const updateNodeInTree = (nodes: any[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (node.id === nodeId) {
              node.wait_time = waitTimeInMinutes;
              return true;
            }

            // Recursively search in children
            if (node.children && updateNodeInTree(node.children)) return true;
            if (node.yesPath && updateNodeInTree(node.yesPath)) return true;
            if (node.noPath && updateNodeInTree(node.noPath)) return true;
          }
          return false;
        };

        updateNodeInTree(newTree.children);
        return newTree;
      });
    }, []);

    const handleDurationChange = useCallback((nodeId: string, durationInDays: number) => {
      // Update the workflow tree with the new duration
      setWorkflowTree((prevTree: any) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));

        const updateNodeInTree = (nodes: any[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (node.id === nodeId) {
              node.duration = durationInDays;
              return true;
            }

            // Recursively search in children
            if (node.children && updateNodeInTree(node.children)) return true;
            if (node.yesPath && updateNodeInTree(node.yesPath)) return true;
            if (node.noPath && updateNodeInTree(node.noPath)) return true;
          }
          return false;
        };

        updateNodeInTree(newTree.children);
        return newTree;
      });

      // Call the prop function if provided
      onDurationChangeProp?.(nodeId, durationInDays);
    }, [onDurationChangeProp]);

    const handleReplaceNode = useCallback(async (nodeIdToReplace: string, newNodeType: string) => {
      try {
        // Call backend API to replace node
        await campaignWorkflowService.replaceNode(nodeIdToReplace, {
          iconType: newNodeType,
          label: getNodeLabel(newNodeType),
          subtitle: getNodeSubtitle(newNodeType),
          isCondition: newNodeType.startsWith('condition_'),
          wait_time: newNodeType === 'wait' ? 1440 : undefined,
          duration: newNodeType === 'wait' ? undefined : 1
        });

        // Update the workflow tree by replacing the node
        setWorkflowTree((prevTree: any) => {
          const newTree = JSON.parse(JSON.stringify(prevTree));

          const replaceNodeInTree = (nodes: any[]): boolean => {
            for (let i = 0; i < nodes.length; i++) {
              const node = nodes[i];

              if (node.id === nodeIdToReplace) {
                // Replace the node with new type while preserving its position and connections
                node.type = newNodeType;
                node.label = getNodeLabel(newNodeType);
                node.subtitle = getNodeSubtitle(newNodeType);
                node.isCondition = newNodeType.startsWith('condition_');

                // Update duration/wait_time based on node type
                if (newNodeType === 'wait') {
                  node.wait_time = 1440; // 1 day in minutes
                  node.duration = undefined;
                } else {
                  node.duration = 1; // 1 day
                  node.wait_time = undefined;
                }

                return true;
              }

              // Recursively search in children
              if (node.children && replaceNodeInTree(node.children)) return true;
              if (node.yesPath && replaceNodeInTree(node.yesPath)) return true;
              if (node.noPath && replaceNodeInTree(node.noPath)) return true;
            }
            return false;
          };

          replaceNodeInTree(newTree.children);
          return newTree;
        });

        // Force save after replace operation
        setTimeout(() => saveWorkflowData(undefined, undefined, undefined, true), 100);
      } catch (error) {
        console.error('Error replacing node:', error);
      }
    }, [saveWorkflowData]);

    const handleAddNode = (nodeType: string) => {
      if (!localSelectedNodeId && !replaceMode) return;

      // Handle replace mode
      if (replaceMode && replaceNodeId) {
        handleReplaceNode(replaceNodeId, nodeType);
        setReplaceMode(false);
        setReplaceNodeId(null);
        setShowNodeSelector(false);
        return;
      }

      // Strict rule: Only allow adding nodes if there's a valid connection point
      if (localSelectedNodeId === 'root' && workflowTree.children.length === 0) {
        // Allow first node to be added as root
      } else if (localSelectedNodeId === 'root' && workflowTree.children.length > 0) {
        // Prevent adding isolated root nodes
        alert('⚠️ Connection Required\n\nAll nodes must be connected to existing nodes. Please add nodes by clicking the "+" button on existing nodes or dragging them to connection points.');
        return;
      }

      setIsLoading(true);
      const newNodeId = uuidv4();
      const newNode = {
        id: newNodeId,
        type: nodeType,
        label: getNodeLabel(nodeType),
        subtitle: getNodeSubtitle(nodeType),
        isCondition: nodeType.startsWith('condition_'),
        position: { x: 250, y: 400 },
        children: [],
        yesPath: nodeType.startsWith('condition_') ? [] : undefined,
        noPath: nodeType.startsWith('condition_') ? [] : undefined,
        duration: nodeType === 'wait' ? undefined : 1, // Default duration of 1 day for non-wait nodes
        wait_time: nodeType === 'wait' ? 1440 : undefined, // Default wait time of 1 day in minutes for wait nodes
      };

      // Update the workflow tree
      setWorkflowTree((prevTree: any) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));

        // If adding a root node
        if (localSelectedNodeId === 'root') {
          return {
            ...newTree,
            children: [...newTree.children, newNode]
          };
        }

        // Find the parent node and add the new node
        const addNodeToTree = (nodes: any[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            // Check if this is the target node (handle both direct node ID and branch-specific ID)
            if (localSelectedNodeId && (node.id === localSelectedNodeId ||
              (localSelectedNodeId.includes('-yes') && node.id === localSelectedNodeId.replace('-yes', '')) ||
              (localSelectedNodeId.includes('-no') && node.id === localSelectedNodeId.replace('-no', '')))) {

              if (localSelectedNodeId.includes('-yes')) {
                // Add to Yes path
                node.yesPath = node.yesPath || [];
                node.yesPath.push(newNode);
              } else if (localSelectedNodeId.includes('-no')) {
                // Add to No path
                node.noPath = node.noPath || [];
                node.noPath.push(newNode);
              } else {
                // Add as regular child
                node.children = node.children || [];
                node.children.push(newNode);
              }
              return true;
            }

            // Recursively search in children
            if (node.children && addNodeToTree(node.children)) return true;
            if (node.yesPath && addNodeToTree(node.yesPath)) return true;
            if (node.noPath && addNodeToTree(node.noPath)) return true;
          }
          return false;
        };

        addNodeToTree(newTree.children);
        return newTree;
      });

      setShowNodeSelector(false);
      setLocalSelectedNodeId(null); // Clear selected node after adding

      // Force save after adding node
      setTimeout(() => saveWorkflowData(undefined, undefined, undefined, true), 100);

      // Complete loading after a short delay to show feedback
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
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

    // Handle drag and drop
    const onDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      // Strict rule: Prevent dropping nodes on empty canvas unless it's the first node
      if (workflowTree.children.length > 0) {
        alert('⚠️ Connection Required\n\nCannot drop isolated nodes. All nodes must be connected to existing nodes. Please drag nodes to the "+" buttons on existing nodes.');
        return;
      }

      // Get the position where the node was dropped
      const reactFlowBounds = (event.target as Element).getBoundingClientRect();
      const dropX = event.clientX - reactFlowBounds.left;
      const dropY = event.clientY - reactFlowBounds.top;

      // Anti-overlap validation for drag and drop
      const nodeWidth = 200;
      const nodeHeight = 80;
      const margin = 20;

      // Check if drop position would overlap with existing nodes
      const wouldOverlap = nodes.some((node: any) => {
        const existingX = node.position.x;
        const existingY = node.position.y;
        const horizontalOverlap = Math.abs(dropX - existingX) < (nodeWidth + nodeWidth) / 2 + margin;
        const verticalOverlap = Math.abs(dropY - existingY) < (nodeHeight + nodeHeight) / 2 + margin;
        return horizontalOverlap && verticalOverlap;
      });

      if (wouldOverlap) {
        alert('⚠️ Position Conflict\n\nCannot place node here as it would overlap with an existing node. Please choose a different position.');
        return;
      }

      const position = {
        x: dropX,
        y: dropY,
      };

      // Create new node at drop position
      const newNodeId = uuidv4();
      const newNode = {
        id: newNodeId,
        type: nodeType,
        label: getNodeLabel(nodeType),
        subtitle: getNodeSubtitle(nodeType),
        isCondition: nodeType.startsWith('condition_'),
        position,
        children: [],
        yesPath: nodeType.startsWith('condition_') ? [] : undefined,
        noPath: nodeType.startsWith('condition_') ? [] : undefined,
        duration: nodeType === 'wait' ? undefined : 1, // Default duration of 1 day for non-wait nodes
        wait_time: nodeType === 'wait' ? 1440 : undefined, // Default wait time of 1 day in minutes for wait nodes
      };

      // Add to root level
      setWorkflowTree((prevTree: any) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        newTree.children.push(newNode);
        return newTree;
      });
    }, [getNodeLabel, getNodeSubtitle]);

    // Handle node drag over for connecting to existing nodes
    const onNodeDragOver = useCallback((event: React.DragEvent, nodeId: string) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'link';
    }, []);

    const onNodeDrop = useCallback((event: React.DragEvent, targetNodeId: string) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      // Create new node and add it as a child of the target node
      const newNodeId = uuidv4();
      const newNode = {
        id: newNodeId,
        type: nodeType,
        label: getNodeLabel(nodeType),
        subtitle: getNodeSubtitle(nodeType),
        isCondition: nodeType.startsWith('condition_'),
        position: { x: 250, y: 400 }, // Default position, will be calculated by convertTreeToFlow
        children: [],
        yesPath: nodeType.startsWith('condition_') ? [] : undefined,
        noPath: nodeType.startsWith('condition_') ? [] : undefined,
        duration: nodeType === 'wait' ? undefined : 1, // Default duration of 1 day for non-wait nodes
        wait_time: nodeType === 'wait' ? 1440 : undefined, // Default wait time of 1 day in minutes for wait nodes
      };

      // Add as child of target node
      setWorkflowTree((prevTree: any) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));

        const addNodeToTarget = (nodes: any[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.id === targetNodeId) {
              if (node.children) {
                node.children.push(newNode);
              } else {
                node.children = [newNode];
              }
              return true;
            }
            if (node.children && addNodeToTarget(node.children)) return true;
            if (node.yesPath && addNodeToTarget(node.yesPath)) return true;
            if (node.noPath && addNodeToTarget(node.noPath)) return true;
          }
          return false;
        };

        addNodeToTarget(newTree.children);
        return newTree;
      });
    }, [getNodeLabel, getNodeSubtitle]);

    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
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
                Drag nodes from the sidebar or click &quot;Add New Step&quot; to begin creating your campaign workflow.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>💡</span>
                <span>Tip: Try dragging a &quot;Send Email&quot; node to get started</span>
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
              onClick={() => saveWorkflowData(undefined, undefined, undefined, true)}
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
  });

export default ReactFlowWrapper;
