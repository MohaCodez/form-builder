import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField, Option } from '../../types/form';
import { useFormStore } from '../../store/formStore';
import { Grip, X } from 'lucide-react';

interface FormFieldComponentProps {
  field: FormField;
  preview?: boolean;
}

export const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  field,
  preview = false,
}) => {
  const { updateField, removeField } = useFormStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: field.id,
    disabled: preview
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCheckboxChange = (optionValue: string) => {
    const updatedOptions = field.options?.map((option) => {
      if (option.value === optionValue) {
        return { ...option, checked: !option.checked }; // Toggle checked state
      }
      return option;
    });
    updateField(field.id, { options: updatedOptions });
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          />
        );
      case 'select':
        return (
          <select className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
            <option value="">Select an option</option>
            {field.options?.map((option: Option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option: Option) => (
              <label key={option.value} className="block flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={option.checked || false}
                  onChange={() => handleCheckboxChange(option.value)} // Update state on change
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option: Option) => (
              <label key={option.value} className="block flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={option.checked || false} // Ensure the radio button reflects the checked state
                  onChange={() => {
                    const updatedOptions = field.options?.map((opt) => ({
                      ...opt,
                      checked: opt.value === option.value, // Set checked state based on selection
                    }));
                    updateField(field.id, { options: updatedOptions });
                  }}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
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
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move p-1 hover:bg-gray-100 rounded"
        >
          <Grip size={20} className="text-gray-400" />
        </div>
        {!preview && (
          <button
            onClick={() => removeField(field.id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {renderField()}
      </div>

      {!preview && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Field Settings</h4>
          <div className="space-y-2">
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              placeholder="Field Label"
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              placeholder="Placeholder"
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Required</span>
            </label>
            {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (one per line)
                </label>
                <textarea
                  value={field.options?.map((opt) => opt.label).join('\n')}
                  onChange={(e) =>
                    updateField(field.id, {
                      options: e.target.value.split('\n').map((opt) => ({
                        label: opt,
                        value: opt,
                        checked: false,
                      })),
                    })
                  }
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  rows={4}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};