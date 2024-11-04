import React, { useState } from 'react';
import { FormField } from '../../types/form';

interface FormPreviewProps {
  fields: FormField[];
  isEditable?: boolean;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ fields, isEditable = false }) => {
  // State to hold the values of the form fields
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type="text"
              placeholder={field.placeholder}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              readOnly={!isEditable}
            />
          </div>
        );
      case 'textarea':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <textarea
              placeholder={field.placeholder}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              readOnly={!isEditable}
            />
          </div>
        );
      case 'select':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              value={formValues[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              disabled={!isEditable}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'checkbox':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formValues[field.id]?.includes(option.value) || false}
                  onChange={() => {
                    const currentValues = formValues[field.id] || [];
                    const newValues = currentValues.includes(option.value)
                      ? currentValues.filter((val: string) => val !== option.value)
                      : [...currentValues, option.value];
                    handleInputChange(field.id, newValues);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  readOnly={!isEditable}
                />
                <span className="ml-2 text-gray-700">{option.label}</span>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="mb-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={formValues[field.id] === option.value}
                  onChange={() => handleInputChange(field.id, option.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  readOnly={!isEditable}
                />
                <span className="ml-2 text-gray-700">{option.label}</span>
              </div>
            ))}
          </div>
        );
      case 'title':
        return (
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{field.label}</h1>
            {field.options && field.options.length > 0 && (
              <h2 className="text-xl font-semibold">{field.options[0].label}</h2>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Form Preview</h2>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            {renderField(field)}
          </div>
        ))}
      </div>
    </form>
  );
};