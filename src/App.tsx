import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FieldPalette } from './components/FormBuilder/FieldPalette';
import { FormCanvas } from './components/FormBuilder/FormCanvas';
import { useFormStore } from './store/formStore';
import { FormField, FieldType } from './types/form';
import { FormFieldComponent } from './components/FormBuilder/FormFieldComponent';
import { FormPreview } from './components/FormBuilder/FormPreview';
import Modal from 'react-modal';

function App() {
  const { activeForm, addField, reorderFields, submitForApproval } = useFormStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
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

        placeholder: (type === 'text' || type === 'textarea') ? `Enter ${type}...` : undefined, // Conditional placeholder
        required: false,
        options:
          type === 'select' || type === 'radio' || type === 'checkbox'
            ? [
                { label: 'Option 1', value: 'Option 1', checked: false },
                { label: 'Option 2', value: 'Option 2', checked: false },
                { label: 'Option 3', value: 'Option 3', checked: false },
              ]
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
        
        
        placeholder:`Enter ${type}...` ,

        required: false,
        options:
          type === 'select' || type === 'radio'|| type === 'checkbox'
            ? [
                { label: 'Option 1', value: 'Option 1', checked: false },
                { label: 'Option 2', value: 'Option 2', checked: false },
                { label: 'Option 3', value: 'Option 3', checked: false },
              ]
            : undefined,
      };
    }
    return activeForm?.fields.find((f) => f.id === activeId) || null;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
              <button
                onClick={openModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Show Preview
              </button>
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
            <div className="flex-1">
              <div className="relative">
                <FormCanvas fields={activeForm?.fields || []} />
              </div>
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="opacity-80">
                <FormFieldComponent 
                  field ={getActiveField()!}
                  preview
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        className="modal w-3/4 mx-auto my-auto relative"
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold"> </h2>
          <button 
            onClick={closeModal} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <FormPreview fields={activeForm?.fields || []} />
      </Modal>
    </div>
  );
}

export default App;
