import React, { useState } from 'react';
import { Form } from '../../types/form';
import { FileText, Edit2, Trash2, Eye } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface FormCardProps {
  form: Form;
  onDelete: (formId: string) => Promise<void>;
}

export const FormCard: React.FC<FormCardProps> = ({ form, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(form.id);
      toast.success('Form deleted successfully');
    } catch (error) {
      toast.error('Failed to delete form');
      console.error('Error deleting form:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (date: any) => {
    if (!date) return 'Date not available';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy') : 'Invalid date';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Card Header */}
      <div className="p-4 flex-grow">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-1" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {form.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {form.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => navigate(`/forms/${form.id}/preview`)}
            className="flex-1 min-w-[80px] dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit2 className="h-4 w-4" />}
            onClick={() => navigate(`/forms/${form.id}/edit`)}
            className="flex-1 min-w-[80px] dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
            loading={isDeleting}
            className="flex-1 min-w-[80px] text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5">
            {form.fields?.length || 0} fields
          </span>
        </div>
        <time dateTime={form.createdAt?.toString()}>
          {formatDate(form.createdAt)}
        </time>
      </div>
    </div>
  );
};