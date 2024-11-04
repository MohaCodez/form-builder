import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FieldType } from '../../types/form';
import {
  Type,
  TextSelect,
  CheckSquare,
  Radio,
  AlignLeft,
  Info,
} from 'lucide-react';

interface FieldPaletteItemProps {
  type: FieldType;
  icon: React.ReactNode;
  label: string;
}

const FieldPaletteItem: React.FC<FieldPaletteItemProps> = ({
  type,
  icon,
  label,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
    >
      <div className="mr-3 text-blue-600">{icon}</div>
      <span className="text-gray-700">{label}</span>
    </div>
  );
};

export const FieldPalette: React.FC = () => {
  const fields: FieldPaletteItemProps[] = [
    { type: 'text', icon: <Type size={20} />, label: 'Text Input' },
    {
      type: 'textarea',
      icon: <AlignLeft size={20} />,
      label: 'Text Area',
    },
    {
      type: 'select',
      icon: <TextSelect size={20} />,
      label: 'Dropdown',
    },
    {
      type: 'checkbox',
      icon: <CheckSquare size={20} />,
      label: 'Checkbox',
    },
    { type: 'radio', icon: <Radio size={20} />, label: 'Radio Group' },
    { type: 'title', icon: <Type size={20} />, label: 'Title' },
    { type: 'formInformation', icon: <Info size={20} />, label: 'Form Information' },
  ];

  return (
    <div className="w-64 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Form Elements
      </h2>
      <div className="space-y-2">
        {fields.map((field) => (
          <FieldPaletteItem key={field.type} {...field} />
        ))}
      </div>
    </div>
  );
};