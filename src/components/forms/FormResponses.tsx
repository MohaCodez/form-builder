import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormResponse, Form } from '../../types/form';
import { getForm } from '../../lib/forms';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../ui/LoadingScreen';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

export default function FormResponses() {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const { formId } = useParams<{ formId: string }>();
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadFormAndResponses = async () => {
      if (!formId || !currentUser) return;
      
      try {
        const formData = await getForm(formId);
        if (!formData) throw new Error('Form not found');
        setForm(formData as Form);
        
        // TODO: Implement getFormResponses in forms.ts
        // const responseData = await getFormResponses(formId);
        // setResponses(responseData);
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Responses for {form.title}
        </h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {responses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No responses yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {response.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(response.submittedAt, 'PPp')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(response.status)}
                            <span className="ml-2 text-sm text-gray-900 capitalize">
                              {response.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {/* TODO: View response */}}
                            >
                              View
                            </Button>
                            {response.status === 'pending' && (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {/* TODO: Approve response */}}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => {/* TODO: Reject response */}}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}