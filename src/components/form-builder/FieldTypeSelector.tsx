import { useState } from 'react';
import { FieldType } from '../../types/form';
import { TextIcon, CheckSquare, CircleDot, ListFilter, Calendar, FileText } from 'lucide-react';

interface FieldTypeSelectorProps {
  onSelect: (type: FieldType) => void;
}

const FIELD_TYPES: { type: FieldType; icon: React.ElementType; label: string }[] = [
  { type: 'text', icon: TextIcon, label: 'Text' },
  { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
  { type: 'radio', icon: CircleDot, label: 'Radio' },
  { type: 'select', icon: ListFilter, label: 'Dropdown' },
  { type: 'date', icon: Calendar, label: 'Date' },
  { type: 'file', icon: FileText, label: 'File Upload' },
];

export default function FieldTypeSelector({ onSelect }: FieldTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Field
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {FIELD_TYPES.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => {
                  onSelect(type);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                role="menuitem"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}