import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserWorkflows, deleteWorkflow, createWorkflow } from '../../lib/workflows';
import { Workflow } from '../../types/workflow';
import { GitBranch, Plus, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingScreen } from '../ui/LoadingScreen';
import { WorkflowCard } from './WorkflowCard';
import { toast } from 'react-hot-toast';

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadWorkflows = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userWorkflows = await getUserWorkflows(user.uid);
      setWorkflows(userWorkflows as Workflow[]);
      setError(null);
    } catch (err) {
      setError('Failed to load workflows. Please try again.');
      console.error('Error loading workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, [user]);

  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      await deleteWorkflow(workflowId);
      await loadWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  };

  const handleNewWorkflow = async () => {
    if (!user) return;
    try {
      const newWorkflow = await createWorkflow(user.uid, {
        name: 'New Workflow',
        description: 'New workflow description'
      });
      navigate(`/workflows/${newWorkflow.id}/edit`);
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => loadWorkflows()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workflows</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and create your workflows
          </p>
        </div>
        <Button
          onClick={handleNewWorkflow}
          icon={<Plus className="h-4 w-4" />}
        >
          New Workflow
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search workflows..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <Button variant="secondary">
          Filter
        </Button>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new workflow.</p>
          <div className="mt-6">
            <Button
              onClick={handleNewWorkflow}
              icon={<Plus className="h-4 w-4" />}
            >
              New Workflow
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onDelete={handleDeleteWorkflow}
            />
          ))}
        </div>
      )}
    </div>
  );
} 