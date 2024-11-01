import React from 'react';
import { FormField } from '../../types/form';
import { FormFieldComponent } from './FormFieldComponent';

interface FormPreviewProps {
  fields: FormField[];
}

export const FormPreview: React.FC<FormPreviewProps> = ({ fields }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Form Preview</h2>
      <div className="space-y-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {fields.map((field) => (
          <div className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-200" key={field.id}>
            <FormFieldComponent field={field} preview />
          </div>
        ))}
      </div>
    </div>
  );
}; 