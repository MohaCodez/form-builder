import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm } from '../../lib/forms';
import { Form } from '../../types/form';
import { LoadingScreen } from '../ui/LoadingScreen';
import FormPreview from '../form-builder/FormPreview';
import toast from 'react-hot-toast';

export default function FormPreviewPage() {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const { formId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) return;

      try {
        const formData = await getForm(formId);
        if (formData) {
          setForm(formData as Form);
        } else {
          toast.error('Form not found');
          navigate('/forms');
        }
      } catch (error) {
        console.error('Error loading form:', error);
        toast.error('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!form) {
    return null;
  }

  return (
    <FormPreview
      title={form.title}
      description={form.description}
      fields={form.fields}
      onClose={() => navigate('/forms')}
    />
  );
}