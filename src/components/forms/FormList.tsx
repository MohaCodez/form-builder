import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserForms, deleteForm } from '../../lib/forms';
import { Form } from '../../types/form';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingScreen } from '../ui/LoadingScreen';
import { FormCard } from './FormCard';

export default function FormList() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadForms = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userForms = await getUserForms(user.uid);
      setForms(userForms as Form[]);
      setError(null);
    } catch (err) {
      setError('Failed to load forms. Please try again.');
      console.error('Error loading forms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, [user]);

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteForm(formId);
      // Refresh the forms list after deletion
      await loadForms();
    } catch (error) {
      console.error('Error deleting form:', error);
      throw error; // Re-throw to be handled by the FormCard component
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
            onClick={() => loadForms()}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forms</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and create your forms
          </p>
        </div>
        <Button
          onClick={() => navigate('/forms/new')}
          icon={<Plus className="h-4 w-4" />}
        >
          New Form
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search forms..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <Button variant="secondary">
          Filter
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new form.</p>
          <div className="mt-6">
            <Button
              onClick={() => navigate('/forms/new')}
              icon={<Plus className="h-4 w-4" />}
            >
              New Form
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onDelete={handleDeleteForm}
            />
          ))}
        </div>
      )}
    </div>
  );
}