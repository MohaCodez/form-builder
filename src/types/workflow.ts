import { Node, Edge } from 'reactflow';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  userId: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: number;
  updatedAt: number;
} 