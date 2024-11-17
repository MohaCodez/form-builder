import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow } from '../../types/workflow';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { DropdownMenu } from '../ui/DropdownMenu';
import toast from 'react-hot-toast';

interface WorkflowCardProps {
  workflow: Workflow;
  onDelete: (workflowId: string) => Promise<void>;
}

export function WorkflowCard({ workflow, onDelete }: WorkflowCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/workflows/${workflow.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(workflow.id);
      toast.success('Workflow deleted successfully');
    } catch (error) {
      toast.error('Failed to delete workflow');
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the date
  const formattedDate = new Date(workflow.updatedAt).toLocaleDateString('en-GB');
  
  // Get the number of nodes - add a safety check
  const nodeCount = Array.isArray(workflow.nodes) ? workflow.nodes.length : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {workflow.name}
          </h3>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item
                onClick={handleEdit}
                icon={<Pencil className="h-4 w-4" />}
              >
                Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600"
                icon={<Trash2 className="h-4 w-4" />}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {workflow.description}
        </p>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {nodeCount} nodes • Last modified {formattedDate}
        </div>
      </div>
    </div>
  );
} 