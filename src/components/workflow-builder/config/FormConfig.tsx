import { Node } from 'reactflow';
import { useWorkflow } from '../../../contexts/WorkflowContext';
import { useEffect, useState } from 'react';
import { Form } from '../../../types/form';
import { getUserForms } from '../../../lib/forms';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../ui/Button';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormConfigProps {
  node: Node;
}

export default function FormConfig({ node }: FormConfigProps) {
  const { updateNodeData } = useWorkflow();
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      if (!user) return;
      try {
        const userForms = await getUserForms(user.uid);
        setForms(userForms as Form[]);
      } catch (error) {
        console.error('Error loading forms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, [user]);

  const selectedForm = forms.find(f => f.id === node.data?.formId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Form
        </label>
        <div className="mt-1 flex items-center gap-2">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={node.data?.formId || ''}
            onChange={(e) => updateNodeData(node.id, { formId: e.target.value })}
            disabled={loading}
          >
            <option value="">Select a form</option>
            {forms.map((form) => (
              <option key={form.id} value={form.id}>
                {form.title}
              </option>
            ))}
          </select>
          {selectedForm && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => navigate(`/forms/${selectedForm.id}/preview`)}
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Form Settings
        </label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              checked={node.data?.allowSave || false}
              onChange={(e) => updateNodeData(node.id, { allowSave: e.target.checked })}
            />
            <span className="ml-2 text-sm text-gray-600">
              Allow saving as draft
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              checked={node.data?.sendEmail || false}
              onChange={(e) => updateNodeData(node.id, { sendEmail: e.target.checked })}
            />
            <span className="ml-2 text-sm text-gray-600">
              Send confirmation email
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Submission Message
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
          value={node.data?.submissionMessage || ''}
          onChange={(e) => updateNodeData(node.id, { submissionMessage: e.target.value })}
          placeholder="Message to show after form submission"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Deadline (Optional)
        </label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.deadline || ''}
          onChange={(e) => updateNodeData(node.id, { deadline: e.target.value })}
          placeholder="Number of days to complete"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Form Validators
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.validators || []}
          onChange={(e) => {
            const options = e.target.options;
            const values = [];
            for (let i = 0; i < options.length; i++) {
              if (options[i].selected) {
                values.push(options[i].value);
              }
            }
            updateNodeData(node.id, { validators: values });
          }}
          multiple
        >
          <option value="required_fields">Required Fields Check</option>
          <option value="email_format">Email Format Validation</option>
          <option value="file_size">File Size Limit</option>
          <option value="custom">Custom Validation</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Hold Ctrl/Cmd to select multiple validators
        </p>
      </div>
    </div>
  );
} 