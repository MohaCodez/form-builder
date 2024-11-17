import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { updateWorkflow } from '../lib/workflows';
import { useAuth } from './AuthContext';

interface WorkflowContextType {
  nodes: Node[];
  edges: Edge[];
  workflowData: any;
  setWorkflowData: (data: any) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: (node: Node) => void;
  saveWorkflow: () => Promise<any>;
  loadWorkflow: (workflowId: string) => Promise<void>;
  updateNodeData: (nodeId: string, data: Record<string, any>) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [workflowData, setWorkflowData] = useState<any>(null);
  const { id } = useParams();
  const { user } = useAuth();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const updateNodeData = useCallback((nodeId: string, data: Record<string, any>) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...data }
          };
        }
        return node;
      })
    );
  }, []);

  const loadWorkflow = useCallback(async (workflowId: string) => {
    if (!user) return;
    
    try {
      const workflowRef = doc(db, 'workflows', workflowId);
      const workflowDoc = await getDoc(workflowRef);
      
      if (!workflowDoc.exists()) {
        throw new Error('Workflow not found');
      }

      const data = workflowDoc.data();
      
      if (data.userId !== user.uid) {
        throw new Error('Unauthorized');
      }

      setWorkflowData({ id: workflowId, ...data });
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } catch (error) {
      console.error('Error loading workflow:', error);
      throw error;
    }
  }, [user]);

  const saveWorkflow = useCallback(async () => {
    if (!id || !user) {
      console.error('Missing id or user');
      return;
    }
    
    try {
      console.log('Starting workflow save...');
      
      // Clean nodes and edges data before saving
      const cleanNodes = nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
        width: node.width,
        height: node.height,
      }));

      const cleanEdges = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        data: edge.data,
      }));

      const updatedWorkflow = {
        id,
        name: workflowData?.name || 'Untitled Workflow',
        description: workflowData?.description || '',
        nodes: cleanNodes,
        edges: cleanEdges,
        userId: user.uid,
        createdAt: workflowData?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      
      console.log('Prepared workflow data:', updatedWorkflow);
      
      const result = await updateWorkflow(id, updatedWorkflow);
      console.log('Save result:', result);
      
      // Update local state
      setWorkflowData(result);
      
      return result;
    } catch (error) {
      console.error('Error in saveWorkflow:', error);
      throw error;
    }
  }, [id, user, workflowData, nodes, edges]);

  useEffect(() => {
    if (id && user) {
      loadWorkflow(id);
    }
  }, [id, user, loadWorkflow]);

  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        edges,
        workflowData,
        setWorkflowData,
        onNodesChange,
        onEdgesChange,
        onConnect,
        saveWorkflow,
        loadWorkflow,
        updateNodeData,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}; 