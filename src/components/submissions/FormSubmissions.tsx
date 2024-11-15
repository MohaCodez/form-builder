import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FormResponse } from '../../types/form';
import { LoadingScreen } from '../ui/LoadingScreen';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { getAllFormResponses } from '../../lib/forms';
import toast from 'react-hot-toast';

export default function FormSubmissions() {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadResponses = async () => {
      if (!currentUser) return;
      try {
        const allResponses = await getAllFormResponses(currentUser.uid);
        setResponses(allResponses);
      } catch (error) {
        console.error('Error loading responses:', error);
        toast.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    loadResponses();
  }, [currentUser]);

  if (loading) return <LoadingScreen />;

  const pendingResponses = responses.filter(r => r.status === 'pending');
  const approvedResponses = responses.filter(r => r.status === 'approved');
  const rejectedResponses = responses.filter(r => r.status === 'rejected');

  const ResponseTable = ({ responses, title }: { responses: FormResponse[], title: string }) => (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {responses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No submissions found</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Title
                </th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {response.formTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(response.submittedAt, 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${response.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${response.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${response.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Eye className="h-4 w-4" />}
                      onClick={() => navigate(`/submissions/${response.id}`)}
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Form Submissions</h1>
      
      <ResponseTable 
        responses={pendingResponses} 
        title="Pending Verification" 
      />
      
      <ResponseTable 
        responses={approvedResponses} 
        title="Verified Submissions" 
      />
      
      <ResponseTable 
        responses={rejectedResponses} 
        title="Rejected Submissions" 
      />
    </div>
  );
}
