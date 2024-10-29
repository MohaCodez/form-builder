import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FieldPalette } from './components/FormBuilder/FieldPalette';
import { FormCanvas } from './components/FormBuilder/FormCanvas';
import { useFormStore } from './store/formStore';
import { FormField, FieldType } from './types/form';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { FormFieldComponent } from './components/FormBuilder/FormFieldComponent';

function App() {
  const { activeForm, addField, reorderFields, submitForApproval } = useFormStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: { active: { id: string } }) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id.toString().startsWith('palette-')) {
      const type = active.data.current?.type as FieldType;
      const newField: FormField = {
        id: crypto.randomUUID(),
        type,
        label: `New ${type} field`,
        placeholder: `Enter ${type}...`,
        required: false,
        options:
          type === 'select' || type === 'radio'
            ? ['Option 1', 'Option 2', 'Option 3']
            : undefined,
      };
      addField(newField);
    } else if (
      activeForm &&
      active.id !== over.id &&
      !active.id.toString().startsWith('palette-')
    ) {
      const oldIndex = activeForm.fields.findIndex(
        (f) => f.id === active.id
      );
      const newIndex = activeForm.fields.findIndex(
        (f) => f.id === over.id
      );

      reorderFields(
        arrayMove(activeForm.fields, oldIndex, newIndex)
      );
    }
  };

  const getActiveField = () => {
    if (!activeId) return null;
    if (activeId.toString().startsWith('palette-')) {
      const type = activeId.replace('palette-', '') as FieldType;
      return {
        id: 'preview',
        type,
        label: `New ${type} field`,
        placeholder: `Enter ${type}...`,
        required: false,
        options:
          type === 'select' || type === 'radio'
            ? ['Option 1', 'Option 2', 'Option 3']
            : undefined,
      };
    }
    return activeForm?.fields.find((f) => f.id === activeId) || null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Form Builder
            </h1>
            <div className="flex items-center space-x-4">
              {activeForm?.status === 'pending' && (
                <div className="flex items-center text-yellow-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span>Pending Approval</span>
                </div>
              )}
              {activeForm?.status === 'approved' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Approved</span>
                </div>
              )}
              <button
                onClick={submitForApproval}
                disabled={
                  !activeForm ||
                  activeForm.status !== 'draft' ||
                  activeForm.fields.length === 0
                }
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-8">
            <FieldPalette />
            <FormCanvas
              fields={activeForm?.fields || []}
            />
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="opacity-80">
                <FormFieldComponent 
                  field={getActiveField()!}
                  preview
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}

export default App;