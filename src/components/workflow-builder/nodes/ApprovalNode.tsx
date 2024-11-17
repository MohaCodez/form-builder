import { NodeProps } from 'reactflow';
import { UserCheck } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function ApprovalNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      title="Approval"
      icon={<UserCheck className="w-4 h-4 text-white" />}
      color="bg-purple-500"
    />
  );
} 