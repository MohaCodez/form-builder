import { NodeProps } from 'reactflow';
import { Square } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function EndNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      title="End"
      icon={<Square className="w-4 h-4 text-white" />}
      color="bg-red-500"
      canHaveOutput={false}
    />
  );
} 