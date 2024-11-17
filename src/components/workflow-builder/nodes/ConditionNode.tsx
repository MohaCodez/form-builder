import { NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function ConditionNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      title="Condition"
      icon={<GitBranch className="w-4 h-4 text-white" />}
      color="bg-cyan-500"
    />
  );
} 