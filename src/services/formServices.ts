import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Form } from "../types/form";

export const formService = {
  loadForms: async (): Promise<Form[]> => {
    try {
      const formsCollection = collection(db, "forms");
      const formsSnapshot = await getDocs(formsCollection);
      return formsSnapshot.docs.map((doc) => ({
        ...(doc.data() as Form),
        id: doc.id,
      }));
    } catch (error) {
      console.error("Error loading forms:", error);
      throw error;
    }
  },

  saveForm: async (form: Form): Promise<void> => {
    try {
      const formRef = doc(db, "forms", form.id);
      await setDoc(formRef, form);
    } catch (error) {
      console.error("Error saving form:", error);
      throw error;
    }
  },

  deleteForm: async (formId: string): Promise<void> => {
    try {
      const formRef = doc(db, "forms", formId);
      await deleteDoc(formRef);
    } catch (error) {
      console.error("Error deleting form:", error);
      throw error;
    }
  },
};
