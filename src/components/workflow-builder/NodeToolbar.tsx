import { useCallback } from 'react';
import { 
  Play, 
  Square, 
  UserCheck, 
  Mail, 
  FileText, 
  Bell, 
  GitBranch 
} from 'lucide-react';

const nodeTypes = [
  { type: 'startNode', label: 'Start', icon: Play, color: 'bg-emerald-500' },
  { type: 'endNode', label: 'End', icon: Square, color: 'bg-rose-500' },
  { type: 'approvalNode', label: 'Approval', icon: UserCheck, color: 'bg-violet-500' },
  { type: 'emailNode', label: 'Email', icon: Mail, color: 'bg-blue-500' },
  { type: 'formNode', label: 'Form', icon: FileText, color: 'bg-orange-500' },
  { type: 'notificationNode', label: 'Notification', icon: Bell, color: 'bg-amber-500' },
  { type: 'conditionNode', label: 'Condition', icon: GitBranch, color: 'bg-cyan-500' },
];

export default function NodeToolbar() {
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-gray-700">Workflow Steps</h2>
      <div className="space-y-1">
        {nodeTypes.map(({ type, label, icon: Icon, color }) => (
          <div
            key={type}
            className="flex items-center gap-3 p-2.5 rounded-md cursor-move 
                     hover:bg-gray-50 transition-colors duration-150 ease-in-out
                     border border-transparent hover:border-gray-200"
            draggable
            onDragStart={(e) => onDragStart(e, type)}
          >
            <div className={`p-2 rounded-md ${color} shadow-sm`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 