import { NodeProps } from 'reactflow';
import { Mail } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function EmailNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      title="Email"
      icon={<Mail className="w-4 h-4 text-white" />}
      color="bg-blue-500"
    />
  );
} 