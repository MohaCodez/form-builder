import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../ui/LoadingScreen';
import { Button } from '../ui/Button';
import { getFormResponse } from '../../lib/forms';
import { FormResponse, FormField } from '../../types/form';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function SubmissionDetails() {
  const [response, setResponse] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { responseId } = useParams<{ responseId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadResponse = async () => {
      if (!responseId) return;
      
      try {
        const responseData = await getFormResponse(responseId);
        setResponse(responseData);
      } catch (error) {
        console.error('Error loading response:', error);
        toast.error('Failed to load submission details');
      } finally {
        setLoading(false);
      }
    };

    loadResponse();
  }, [responseId]);

  if (loading) return <LoadingScreen />;
  if (!response) return <div>Submission not found</div>;

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  // Function to render the field value based on its type
  const renderFieldValue = (field: FormField, value: any) => {
    switch (field.type) {
      case 'checkbox':
        return value ? 'Yes' : 'No';
      case 'file':
        return value ? 'File uploaded' : 'No file';
      default:
        return value?.toString() || 'No response';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/submissions')}
          >
            Back to Submissions
          </Button>
          <h1 className="text-2xl font-bold">{response.formTitle}</h1>
          {getStatusBadge(response.status)}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Submission Details</h2>
          <p className="text-sm text-gray-500">
            Submitted on {format(response.submittedAt, 'PPp')}
          </p>
        </div>
        
        <div className="px-6 py-4">
          {response.fields?.map((field: FormField) => (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <div className="mt-1 text-sm text-gray-900">
                {renderFieldValue(field, response.data[field.id])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}