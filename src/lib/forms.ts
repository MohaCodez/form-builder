import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Form, FormField } from '../types/form';
import toast from 'react-hot-toast';

export const createForm = async (title: string, description: string, fields: FormField[], userId: string) => {
  try {
    const formsRef = collection(db, 'forms');
    const form = {
      title,
      description,
      fields,
      status: 'draft',
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(formsRef, form);
    return docRef.id;
  } catch (error) {
    console.error('Error creating form:', error);
    throw error;
  }
};

export const updateForm = async (formId: string, updates: Partial<Form>) => {
  try {
    const formRef = doc(db, 'forms', formId);
    await updateDoc(formRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
};

export const deleteForm = async (formId: string) => {
  try {
    const formRef = doc(db, 'forms', formId);
    await deleteDoc(formRef);
    toast.success('Form deleted successfully');
  } catch (error) {
    console.error('Error deleting form:', error);
    toast.error('Failed to delete form');
    throw error;
  }
};

export const getForm = async (formId: string) => {
  try {
    const formRef = doc(db, 'forms', formId);
    const formSnap = await getDoc(formRef);
    return formSnap.exists() ? { id: formSnap.id, ...formSnap.data() } : null;
  } catch (error) {
    console.error('Error getting form:', error);
    throw error;
  }
};

export const getUserForms = async (userId: string) => {
  try {
    const formsRef = collection(db, 'forms');
    const q = query(formsRef, where('createdBy', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user forms:', error);
    throw error;
  }
};