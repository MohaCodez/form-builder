import { NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function FormNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      title="Form"
      icon={<FileText className="w-4 h-4 text-white" />}
      color="bg-orange-500"
    />
  );
} 