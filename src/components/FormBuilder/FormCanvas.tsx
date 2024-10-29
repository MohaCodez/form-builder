import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FormField } from '../../types/form';
import { FormFieldComponent } from './FormFieldComponent';

interface FormCanvasProps {
  fields: FormField[];
}

export const FormCanvas: React.FC<FormCanvasProps> = ({ fields }) => {
  const { setNodeRef } = useDroppable({
    id: 'form-canvas',
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 bg-white rounded-lg p-6 min-h-[600px] shadow-sm"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Form Canvas
      </h2>
      <div className="space-y-4">
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field) => (
            <FormFieldComponent key={field.id} field={field} />
          ))}
        </SortableContext>
        {fields.length === 0 && (
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">
              Drag and drop form elements here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};