import { create } from "zustand";
import { FormField, Form } from "../types/form";
import { formService } from "../services/formServices";

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
  saveForm: () => Promise<void>;
  loadForms: () => Promise<void>;
  deleteForm: (formId: string) => Promise<void>;
}

export const useFormStore = create<FormStore>((set, get) => ({
  forms: [],
  activeForm: {
    id: crypto.randomUUID(),
    name: "Untitled Form",
    fields: [],
    status: "draft",
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
            status: "pending",
            updatedAt: new Date(),
          }
        : null,
    })),
  createNewForm: () =>
    set({
      activeForm: {
        id: crypto.randomUUID(),
        name: "Untitled Form",
        fields: [],
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  saveForm: async () => {
    const state = get();
    if (!state.activeForm) return;

    try {
      await formService.saveForm(state.activeForm);

      // Update the forms array
      set((state) => ({
        forms: state.forms.some((f) => f.id === state.activeForm?.id)
          ? state.forms.map((f) =>
              f.id === state.activeForm?.id ? state.activeForm! : f
            )
          : [...state.forms, state.activeForm!],
      }));

      console.log("Form saved successfully");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  },
  loadForms: async () => {
    try {
      const forms = await formService.loadForms();
      set({ forms });
    } catch (error) {
      console.error("Error loading forms:", error);
    }
  },
  deleteForm: async (formId) => {
    await formService.deleteForm(formId);
    set((state) => ({
      forms: state.forms.filter((f) => f.id !== formId),
    }));
  },
}));
