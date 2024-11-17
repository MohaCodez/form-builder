import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '../../../lib/utils';

interface BaseNodeProps extends NodeProps {
  title: string;
  icon: React.ReactNode;
  color?: string;
  canHaveInput?: boolean;
  canHaveOutput?: boolean;
}

export function BaseNode({
  title,
  icon,
  color = 'bg-blue-500',
  canHaveInput = true,
  canHaveOutput = true,
  selected,
  ...props
}: BaseNodeProps) {
  return (
    <div
      className={cn(
        'px-4 py-2 rounded-lg shadow-sm border-2 min-w-[150px]',
        selected ? 'border-blue-500' : 'border-gray-200',
        'bg-white'
      )}
    >
      {canHaveInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-500"
        />
      )}
      
      <div className="flex items-center gap-2">
        <div className={cn('p-2 rounded-lg', color)}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {props.data?.label && (
            <p className="text-xs text-gray-500">{props.data.label}</p>
          )}
        </div>
      </div>

      {canHaveOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-500"
        />
      )}
    </div>
  );
} 