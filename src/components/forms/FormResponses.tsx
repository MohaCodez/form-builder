import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormResponse, Form } from '../../types/form';
import { getForm, getFormResponses } from '../../lib/forms';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../ui/LoadingScreen';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Button } from '../ui/Button';

export default function FormResponses() {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const { formId } = useParams<{ formId: string }>();
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadFormAndResponses = async () => {
      if (!formId || !currentUser) {
        console.log('Missing formId or currentUser:', { formId, currentUser });
        return;
      }
      
      try {
        const formData = await getForm(formId);
        console.log('Form data:', formData);
        if (!formData) throw new Error('Form not found');
        setForm(formData as Form);
        
        const responseData = await getFormResponses(formId);
        console.log('Response data:', responseData);
        setResponses(responseData);
      } catch (error) {
        console.error('Error loading form responses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormAndResponses();
  }, [formId, currentUser]);

  if (loading) return <LoadingScreen />;
  if (!form) return <div>Form not found</div>;

  const getStatusIcon = (status: FormResponse['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{form.title} - Responses</h1>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No responses yet</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {responses.map((response) => (
                <tr key={response.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(response.submittedAt, 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(response.status)}
                      <span className="ml-2 text-sm text-gray-900">
                        {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Eye className="h-4 w-4" />}
                      // TODO: Implement view response details
                      onClick={() => {}}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}