import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Workflow } from '../types/workflow';

// Get workflows
export async function getUserWorkflows(userId: string) {
  const q = query(collection(db, 'workflows'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Create workflow
export async function createWorkflow(userId: string, workflowData: Partial<Workflow>) {
  const newWorkflow = {
    ...workflowData,
    userId,
    nodes: [],
    edges: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const docRef = await addDoc(collection(db, 'workflows'), newWorkflow);
  return { id: docRef.id, ...newWorkflow };
}

// Update workflow
export async function updateWorkflow(workflowId: string, data: Partial<Workflow>) {
  const workflowRef = doc(db, 'workflows', workflowId);
  
  try {
    console.log('Updating workflow with data:', data);
    
    // Ensure the data is properly structured
    const updatedData = {
      name: data.name || 'Untitled Workflow',
      description: data.description || '',
      nodes: data.nodes || [],
      edges: data.edges || [],
      userId: data.userId,
      updatedAt: Date.now(),
      // Preserve creation date if it exists
      ...(data.createdAt && { createdAt: data.createdAt }),
    };

    await updateDoc(workflowRef, updatedData);
    console.log('Workflow updated successfully');
    
    return { id: workflowId, ...updatedData };
  } catch (error) {
    console.error('Error in updateWorkflow:', error);
    throw error;
  }
}

// Delete workflow
export async function deleteWorkflow(workflowId: string) {
  await deleteDoc(doc(db, 'workflows', workflowId));
} 