import { Node } from 'reactflow';
import { useWorkflow } from '../../../contexts/WorkflowContext';
import { Button } from '../../ui/Button';

interface ApprovalConfigProps {
  node: Node;
}

export default function ApprovalConfig({ node }: ApprovalConfigProps) {
  const { updateNodeData } = useWorkflow();

  const handleApproverChange = (value: string) => {
    updateNodeData(node.id, { approver: value });
  };

  const handleDeadlineChange = (value: string) => {
    updateNodeData(node.id, { deadline: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Approver
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.approver || ''}
          onChange={(e) => handleApproverChange(e.target.value)}
        >
          <option value="">Select approver</option>
          <option value="manager">Manager</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Deadline (days)
        </label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.deadline || ''}
          onChange={(e) => handleDeadlineChange(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          value={node.data?.comments || ''}
          onChange={(e) => updateNodeData(node.id, { comments: e.target.value })}
        />
      </div>
    </div>
  );
} 