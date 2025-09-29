import React from 'react';

const WorkflowGuide = () => (
  <div className="mt-4 space-y-4">
    <div className="text-center py-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Builder Guide</h3>
      <p className="text-sm text-gray-600">Learn how to create effective automation workflows</p>
    </div>

    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <h3 className="font-semibold text-blue-900">Getting Started</h3>
        </div>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Click "Add New Step" button to start building your workflow</p>
          <p>• Drag action cards from the canvas to connect nodes</p>
          <p>• Use the "+" buttons on nodes to add sequential steps</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">2</span>
          </div>
          <h3 className="font-semibold text-green-900">Connection Rules</h3>
        </div>
        <div className="text-sm text-green-800 space-y-1">
          <p>• All nodes must be connected (except the first one)</p>
          <p>• Use conditional nodes to create Yes/No branches</p>
          <p>• Each branch can have its own sequence of actions</p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">3</span>
          </div>
          <h3 className="font-semibold text-orange-900">Timing Control</h3>
        </div>
        <div className="text-sm text-orange-800 space-y-1">
          <p>• Click the edit icon on any node to set execution duration</p>
          <p>• Set delays between actions to avoid spam detection</p>
          <p>• Use wait nodes for longer delays between sequences</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">4</span>
          </div>
          <h3 className="font-semibold text-purple-900">Best Practices</h3>
        </div>
        <div className="text-sm text-purple-800 space-y-1">
          <p>• Start with profile visits before sending connection requests</p>
          <p>• Add delays between actions to appear more natural</p>
          <p>• Use conditions to personalize your outreach</p>
        </div>
      </div>
    </div>
  </div>
);

export default WorkflowGuide;





