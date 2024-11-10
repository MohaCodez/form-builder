import { FormField } from '../../types/form';
import { Trash2, X } from 'lucide-react';

interface FormFieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function FormFieldEditor({
  field,
  onUpdate,
  onDelete,
  onClose,
}: FormFieldEditorProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Edit Field</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {(field.type === 'text' || field.type === 'date') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        )}

        {(field.type === 'radio' || field.type === 'select') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Options (one per line)
            </label>
            <textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) =>
                onUpdate({ options: e.target.value.split('\n').filter(Boolean) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={4}
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
            Required field
          </label>
        </div>
      </div>
    </div>
  );
}