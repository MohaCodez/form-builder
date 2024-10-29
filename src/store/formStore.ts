import { create } from 'zustand';
import { FormField, Form } from '../types/form';

interface FormStore {
  forms: Form[];
  activeForm: Form | null;
  setActiveForm: (form: Form | null) => void;
  addField: (field: FormField) => void;
  updateField: (id: string, field: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (fields: FormField[]) => void;
  submitForApproval: () => void;
  createNewForm: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  forms: [],
  activeForm: {
    id: crypto.randomUUID(),
    name: 'Untitled Form',
    fields: [],
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setActiveForm: (form) => set({ activeForm: form }),
  addField: (field) =>
    set((state) => ({
      activeForm: state.activeForm
        ? {
            ...state.activeForm,
            fields: [...state.activeForm.fields, field],
            updatedAt: new Date(),
          }
        : null,
    })),
  updateField: (id, updatedField) =>
    set((state) => ({
      activeForm: state.activeForm
        ? {
            ...state.activeForm,
            fields: state.activeForm.fields.map((field) =>
              field.id === id ? { ...field, ...updatedField } : field
            ),
            updatedAt: new Date(),
          }
        : null,
    })),
  removeField: (id) =>
    set((state) => ({
      activeForm: state.activeForm
        ? {
            ...state.activeForm,
            fields: state.activeForm.fields.filter((field) => field.id !== id),
            updatedAt: new Date(),
          }
        : null,
    })),
  reorderFields: (fields) =>
    set((state) => ({
      activeForm: state.activeForm
        ? {
            ...state.activeForm,
            fields,
            updatedAt: new Date(),
          }
        : null,
    })),
  submitForApproval: () =>
    set((state) => ({
      activeForm: state.activeForm
        ? {
            ...state.activeForm,
            status: 'pending',
            updatedAt: new Date(),
          }
        : null,
    })),
  createNewForm: () =>
    set({
      activeForm: {
        id: crypto.randomUUID(),
        name: 'Untitled Form',
        fields: [],
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
}));