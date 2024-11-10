import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { PlusCircle, GripVertical, Save, Eye } from 'lucide-react';
import { FormField, Form } from '../../types/form';
import { createForm, getForm, updateForm } from '../../lib/forms';
import { useAuth } from '../../contexts/AuthContext';
import FieldTypeSelector from './FieldTypeSelector';
import FormFieldEditor from './FormFieldEditor';
import FormPreview from './FormPreview';
import { Button } from '../ui/Button';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import { LoadingScreen } from '../ui/LoadingScreen';

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formId } = useParams();

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) {
        setLoading(false);
        return;
      }

      try {
        const formData = await getForm(formId);
        if (formData) {
          setTitle(formData.title);
          setDescription(formData.description);
          setFields(formData.fields);
        }
      } catch (error) {
        console.error('Error loading form:', error);
        toast.error('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(items);
  };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: nanoid(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: '',
    };
    setFields([...fields, newField]);
    setEditingField(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
    setEditingField(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    if (fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }

    try {
      setSaving(true);
      if (formId) {
        await updateForm(formId, { title, description, fields });
        toast.success('Form updated successfully');
      } else {
        const newFormId = await createForm(title, description, fields, user!.uid);
        toast.success('Form created successfully');
        navigate(`/forms/${newFormId}`);
      }
    } catch (error) {
      toast.error(formId ? 'Failed to update form' : 'Failed to create form');
      console.error('Error saving form:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (showPreview) {
    return (
      <FormPreview
        title={title}
        description={description}
        fields={fields}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-4 flex-1 mr-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form Title"
            className="block w-full text-2xl font-bold border-0 border-b-2 border-gray-200 focus:border-indigo-600 focus:ring-0 bg-transparent"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Form Description (optional)"
            className="block w-full text-gray-500 border-0 border-b-2 border-gray-200 focus:border-indigo-600 focus:ring-0 bg-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </Button>
          <Button
            icon={<Save className="h-4 w-4" />}
            loading={saving}
            onClick={handleSave}
          >
            {formId ? 'Update Form' : 'Save Form'}
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <FieldTypeSelector onSelect={addField} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="text-gray-400" />
                        </div>
                        {editingField === field.id ? (
                          <FormFieldEditor
                            field={field}
                            onUpdate={(updates) => updateField(field.id, updates)}
                            onDelete={() => deleteField(field.id)}
                            onClose={() => setEditingField(null)}
                          />
                        ) : (
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => setEditingField(field.id)}
                          >
                            <h3 className="font-medium">{field.label}</h3>
                            <p className="text-sm text-gray-500">
                              {field.type} {field.required && '(required)'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {fields.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No fields</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new field</p>
        </div>
      )}
    </div>
  );
}