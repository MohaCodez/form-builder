import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Form } from '../../types/form';
import toast from 'react-hot-toast';
import { LoadingScreen } from '../ui/LoadingScreen';

export default function PublicForm() {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { formId } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) return;
      
      try {
        const formDoc = await getDoc(doc(db, 'forms', formId));
        if (formDoc.exists()) {
          setForm({ id: formDoc.id, ...formDoc.data() } as Form);
        }
      } catch (error) {
        console.error('Error loading form:', error);
        toast.error('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const onSubmit = async (data: any) => {
    if (!form || !formId) return;

    try {
      setSubmitting(true);
      
      // Save form response
      await addDoc(collection(db, 'forms', formId, 'responses'), {
        data,
        submittedAt: new Date(),
        status: 'pending'
      });

      // Send email if checkbox is checked
      if (data.sendCopy) {
        // Implement email sending logic here
      }

      toast.success('Form submitted successfully');
      
      // Reset form
      window.location.reload();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Form not found</h1>
          <p className="mt-2 text-gray-600">The form you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600 mb-6">{form.description}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  {...register(field.id, { required: field.required })}
                  placeholder={field.placeholder}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}

              {field.type === 'checkbox' && (
                <div className="mt-1">
                  <input
                    type="checkbox"
                    {...register(field.id)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {field.label}
                  </span>
                </div>
              )}

              {errors[field.id] && (
                <p className="mt-1 text-sm text-red-600">
                  This field is required
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
} 