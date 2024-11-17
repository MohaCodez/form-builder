import { useState, useCallback, DragEvent } from 'react';
import ReactFlow, {
  Node,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

import { StartNode } from './nodes/StartNode';
import { EndNode } from './nodes/EndNode';
import { ApprovalNode } from './nodes/ApprovalNode';
import { EmailNode } from './nodes/EmailNode';
import { FormNode } from './nodes/FormNode';
import { NotificationNode } from './nodes/NotificationNode';
import { ConditionNode } from './nodes/ConditionNode';
import NodeToolbar from './NodeToolbar';
import NodeConfigPanel from './NodeConfigPanel';
import { useWorkflow } from '../../contexts/WorkflowContext';

const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  approvalNode: ApprovalNode,
  emailNode: EmailNode,
  formNode: FormNode,
  notificationNode: NotificationNode,
  conditionNode: ConditionNode,
};

export default function WorkflowBuilder() {
  // Context and state
  const { 
    nodes, 
    edges, 
    workflowData, 
    setWorkflowData, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    saveWorkflow 
  } = useWorkflow();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const navigate = useNavigate();

  // Drag and drop handlers
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    if (!reactFlowInstance) return;

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: `New ${type}` },
    };

    onNodesChange([{ type: 'add', item: newNode }]);
  }, [reactFlowInstance, onNodesChange]);

  // Save handler
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (!workflowData?.name) {
        toast.error('Please enter a workflow name');
        return;
      }

      // Debug logging
      console.log('Current nodes:', nodes);
      console.log('Current edges:', edges);
      console.log('Current workflowData:', workflowData);
      
      const result = await saveWorkflow();
      console.log('Save result:', result);
      
      toast.success('Workflow saved successfully');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  // Render components
  const renderSidebar = () => (
    <div className="w-72 border-r border-gray-200 bg-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <input
            type="text"
            className="text-lg font-medium text-gray-900 bg-transparent border-0 focus:ring-0 p-0 placeholder-gray-400"
            value={workflowData?.name || ''}
            onChange={(e) => setWorkflowData({ ...workflowData, name: e.target.value })}
            placeholder="Untitled Workflow"
          />
          <Button
            onClick={handleSave}
            disabled={isSaving}
            icon={<Save className="h-4 w-4" />}
            size="sm"
            variant="primary"
          >
            Save
          </Button>
        </div>
        <div className="p-4">
          <NodeToolbar />
        </div>
      </div>
    </div>
  );

  const renderFlowCanvas = () => (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        snapToGrid
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );

  const renderConfigPanel = () => (
    selectedNode && (
      <div className="w-80 border-l bg-white p-4">
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    )
  );

  return (
    <div className="h-screen flex">
      {renderSidebar()}
      {renderFlowCanvas()}
      {renderConfigPanel()}
    </div>
  );
}