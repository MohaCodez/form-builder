import { Node } from 'reactflow';
import { useWorkflow } from '../../../contexts/WorkflowContext';

interface NotificationConfigProps {
  node: Node;
}

export default function NotificationConfig({ node }: NotificationConfigProps) {
  const { updateNodeData } = useWorkflow();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notification Type
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.type || ''}
          onChange={(e) => updateNodeData(node.id, { type: e.target.value })}
        >
          <option value="">Select type</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push Notification</option>
          <option value="in_app">In-App Notification</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recipients
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.recipients || ''}
          onChange={(e) => updateNodeData(node.id, { recipients: e.target.value })}
          multiple
        >
          <option value="requester">Requester</option>
          <option value="approver">Approver</option>
          <option value="manager">Manager</option>
          <option value="department">Department</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Hold Ctrl/Cmd to select multiple recipients
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.title || ''}
          onChange={(e) => updateNodeData(node.id, { title: e.target.value })}
          placeholder="Notification title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message Template
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={4}
          value={node.data?.message || ''}
          onChange={(e) => updateNodeData(node.id, { message: e.target.value })}
          placeholder="Use {{variables}} for dynamic content"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.priority || 'normal'}
          onChange={(e) => updateNodeData(node.id, { priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>
  );
} 