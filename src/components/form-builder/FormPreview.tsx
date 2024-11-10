import { Form } from 'lucide-react';
import { FormField } from '../../types/form';
import { Button } from '../ui/Button';

interface FormPreviewProps {
  title: string;
  description: string;
  fields: FormField[];
  onClose: () => void;
}

export default function FormPreview({ title, description, fields, onClose }: FormPreviewProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Form Preview</h2>
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{title || 'Untitled Form'}</h1>
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required={field.required}
                />
              )}

              {field.type === 'checkbox' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    required={field.required}
                  />
                  <span className="ml-2 text-sm text-gray-600">{field.label}</span>
                </div>
              )}

              {field.type === 'radio' && field.options && (
                <div className="space-y-2">
                  {field.options.map((option, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="radio"
                        name={field.id}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        required={field.required}
                      />
                      <span className="ml-2 text-sm text-gray-600">{option}</span>
                    </div>
                  ))}
                </div>
              )}

              {field.type === 'select' && field.options && (
                <select 
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required={field.required}
                >
                  <option value="">Select an option</option>
                  {field.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required={field.required}
                />
              )}

              {field.type === 'file' && (
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                  required={field.required}
                />
              )}
            </div>
          ))}

          <div className="pt-4 border-t">
            <Button type="submit" disabled>
              Submit Form
            </Button>
            <p className="mt-2 text-sm text-gray-500">
              This is a preview. Form submission is disabled.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}