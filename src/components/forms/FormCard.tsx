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
  
  // Safely format the date, handling both Firestore Timestamp and Date objects
  const formatDate = (date: any) => {
    if (!date) return 'Date not available';
    
    // Convert Firestore timestamp to Date if necessary
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    
    return isValid(dateObj) 
      ? format(dateObj, 'MMM d, yyyy')
      : 'Invalid date';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-indigo-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">{form.title}</h3>
              <p className="text-sm text-gray-500">{form.description}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => navigate(`/forms/${form.id}/preview`)}
            >
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Edit2 className="h-4 w-4" />}
              onClick={() => navigate(`/forms/${form.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={handleDelete}
              loading={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </div>
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>{form.fields?.length || 0} fields</span>
          <span>Created {formatDate(form.createdAt)}</span>
        </div>
      </div>
  );
};