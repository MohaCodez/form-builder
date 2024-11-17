import { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function StartNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      title="Start"
      icon={<Play className="w-4 h-4 text-white" />}
      color="bg-green-500"
      canHaveInput={false}
    />
  );
} 