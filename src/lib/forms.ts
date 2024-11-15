import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Form, FormField, FormResponse } from '../types/form';
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

export const getAllFormResponses = async (userId: string) => {
  try {
    const formsRef = collection(db, 'forms');
    const userFormsQuery = query(formsRef, where('createdBy', '==', userId));
    const userForms = await getDocs(userFormsQuery);
    
    const allResponses: FormResponse[] = [];
    
    for (const formDoc of userForms.docs) {
      const responsesRef = collection(db, 'forms', formDoc.id, 'responses');
      const responsesDocs = await getDocs(responsesRef);
      
      const formResponses = responsesDocs.docs.map(doc => ({
        id: doc.id,
        formId: formDoc.id,
        formTitle: formDoc.data().title,
        userId: doc.data().userId,
        status: doc.data().status,
        data: doc.data().data,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate(),
        reviewedAt: doc.data().reviewedAt?.toDate()
      })) as FormResponse[];
      
      allResponses.push(...formResponses);
    }
    
    return allResponses;
  } catch (error) {
    console.error('Error getting all form responses:', error);
    throw error;
  }
};

export const getFormResponses = async (formId: string) => {
  try {
    const responsesRef = collection(db, 'forms', formId, 'responses');
    const querySnapshot = await getDocs(responsesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate(),
      reviewedAt: doc.data().reviewedAt?.toDate()
    })) as FormResponse[];
  } catch (error) {
    console.error('Error getting form responses:', error);
    throw error;
  }
};

export const getFormResponse = async (responseId: string) => {
  try {
    const formsRef = collection(db, 'forms');
    const formsSnapshot = await getDocs(formsRef);
    
    for (const formDoc of formsSnapshot.docs) {
      const responseRef = doc(db, 'forms', formDoc.id, 'responses', responseId);
      const responseSnap = await getDoc(responseRef);
      
      if (responseSnap.exists()) {
        const formData = formDoc.data();
        return {
          id: responseSnap.id,
          formId: formDoc.id,
          formTitle: formDoc.data().title,
          fields: formData.fields,
          userId: responseSnap.data().userId,
          status: responseSnap.data().status,
          data: responseSnap.data().data,
          ...responseSnap.data(),
          submittedAt: responseSnap.data().submittedAt?.toDate(),
          reviewedAt: responseSnap.data().reviewedAt?.toDate()
        } as FormResponse;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting form response:', error);
    throw error;
  }
};