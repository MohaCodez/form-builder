import { NodeProps } from 'reactflow';
import { Bell } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function NotificationNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      title="Notification"
      icon={<Bell className="w-4 h-4 text-white" />}
      color="bg-yellow-500"
    />
  );
} 