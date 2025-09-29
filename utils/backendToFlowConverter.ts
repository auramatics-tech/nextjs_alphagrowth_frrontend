// Single direct conversion from backend data to React Flow format
export const convertBackendToFlow = (
  backendNodes: any[], 
  backendEdges: any[],
  handlers: {
    handlePlusClick: (sourceId: string, branch?: 'yes' | 'no') => void;
    handleReplaceClick: (nodeId: string) => void;
    handleDeleteNode: (nodeId: string) => void;
    onNodeClick: (nodeId: string, nodeData: any) => void;
    handleWaitTimeChange: (nodeId: string, waitTimeInMinutes: number) => void;
    handleDurationChange: (nodeId: string, durationInDays: number) => void;
    onNodeDragOver: (event: React.DragEvent, nodeId: string) => void;
    onNodeDrop: (event: React.DragEvent, nodeId: string) => void;
  }
) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  const nodeMap = new Map();
  
  // Constants for positioning
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 80;
  const VERTICAL_SPACING = 200;
  const HORIZONTAL_SPACING = 300;
  
  // Create nodes map for quick lookup
  backendNodes.forEach(node => {
    const flowNode = {
      id: node.id,
      type: 'custom',
      position: { x: 250, y: 100 }, // Default position, will be calculated
      data: {
        label: node.data?.label || node.label,
        iconType: node.data?.iconType || node.action_key,
        action_key: node.action_key,
        subtitle: node.data?.subtitle || '',
        isCondition: node.data?.isCondition || false,
        hasYesBranch: false,
        hasNoBranch: false,
        onPlusClick: () => handlers.handlePlusClick(node.id),
        onYesClick: undefined,
        onNoClick: undefined,
        onYesDrop: undefined,
        onNoDrop: undefined,
        onReplaceClick: () => handlers.handleReplaceClick(node.id),
        onDeleteClick: () => handlers.handleDeleteNode(node.id),
        onNodeClick: () => handlers.onNodeClick(node.id, { iconType: node.action_key }),
        onWaitTimeChange: (nodeId: string, waitTime: number) => handlers.handleWaitTimeChange(nodeId, waitTime),
        onDurationChange: (nodeId: string, duration: number) => handlers.handleDurationChange(nodeId, duration),
        onNodeDragOver: (event: React.DragEvent, nodeId: string) => handlers.onNodeDragOver(event, nodeId),
        onNodeDrop: (event: React.DragEvent, nodeId: string) => handlers.onNodeDrop(event, nodeId),
        sourceId: undefined,
      }
    };
    nodes.push(flowNode);
    nodeMap.set(node.id, flowNode);
  });
  
  // Calculate positions based on relationships
  const processedNodes = new Set();
  let yOffset = 100;
  
  // Find root nodes (no incoming edges)
  const hasIncomingEdge = new Set(backendEdges.map(edge => edge.target));
  const rootNodes = backendNodes.filter(node => !hasIncomingEdge.has(node.id));
  
  // Position root nodes
  rootNodes.forEach((node, index) => {
    const flowNode = nodeMap.get(node.id);
    if (flowNode) {
      flowNode.position = {
        x: 250 + (index - (rootNodes.length - 1) / 2) * (NODE_WIDTH + 100),
        y: yOffset
      };
      processedNodes.add(node.id);
    }
  });
  
  // Position child nodes
  const positionChildren = (parentId: string, parentY: number, branchType: 'left' | 'right' | 'center' = 'center') => {
    const childEdges = backendEdges.filter(edge => edge.source === parentId);
    let childY = parentY + NODE_HEIGHT + VERTICAL_SPACING;
    
    childEdges.forEach((edge, index) => {
      const childNode = nodeMap.get(edge.target);
      if (childNode && !processedNodes.has(edge.target)) {
        let childX = 250; // Default center
        
        if (branchType === 'left') {
          childX = 250 - HORIZONTAL_SPACING;
        } else if (branchType === 'right') {
          childX = 250 + HORIZONTAL_SPACING;
        }
        
        // Handle Yes/No branches
        if (edge.label === 'Yes') {
          childX = 250 - HORIZONTAL_SPACING;
        } else if (edge.label === 'No') {
          childX = 250 + HORIZONTAL_SPACING;
        }
        
        childNode.position = { x: childX, y: childY + (index * (NODE_HEIGHT + 50)) };
        processedNodes.add(edge.target);
        
        // Recursively position children
        positionChildren(edge.target, childY + (index * (NODE_HEIGHT + 50)));
      }
    });
  };
  
  // Position all nodes starting from roots
  rootNodes.forEach(node => {
    const flowNode = nodeMap.get(node.id);
    if (flowNode) {
      positionChildren(node.id, flowNode.position.y);
    }
  });
  
  // Create edges
  backendEdges.forEach(edge => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    
    if (sourceNode && targetNode) {
      const flowEdge = {
        id: `e${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.label === 'Yes' ? 'yes' : (edge.label === 'No' ? 'no' : undefined),
        type: 'smoothstep',
        animated: true,
        label: edge.label === 'Yes' ? 'Yes' : (edge.label === 'No' ? 'No' : undefined),
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#fff', stroke: '#ccc', strokeWidth: 1 },
        labelStyle: { 
          fill: edge.label === 'Yes' ? '#22C55E' : (edge.label === 'No' ? '#EF4444' : '#6B7280'), 
          fontWeight: 600 
        },
        style: { 
          stroke: edge.label === 'Yes' ? '#22C55E' : (edge.label === 'No' ? '#EF4444' : '#6B7280'), 
          strokeWidth: 2 
        }
      };
      edges.push(flowEdge);
    }
  });
  
  return { nodes, edges };
};

