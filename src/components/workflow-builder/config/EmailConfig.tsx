import { Node } from 'reactflow';
import { useWorkflow } from '../../../contexts/WorkflowContext';

interface EmailConfigProps {
  node: Node;
}

export default function EmailConfig({ node }: EmailConfigProps) {
  const { updateNodeData } = useWorkflow();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          To
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.to || ''}
          onChange={(e) => updateNodeData(node.id, { to: e.target.value })}
          placeholder="recipient@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.subject || ''}
          onChange={(e) => updateNodeData(node.id, { subject: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Template
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.template || ''}
          onChange={(e) => updateNodeData(node.id, { template: e.target.value })}
        >
          <option value="">Select template</option>
          <option value="approval">Approval Request</option>
          <option value="notification">Notification</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {node.data?.template === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={5}
            value={node.data?.content || ''}
            onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
          />
        </div>
      )}
    </div>
  );
} 