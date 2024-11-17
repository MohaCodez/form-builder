import { Node } from 'reactflow';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import ApprovalConfig from './config/ApprovalConfig';
import EmailConfig from './config/EmailConfig';
import FormConfig from './config/FormConfig';
import NotificationConfig from './config/NotificationConfig';
import ConditionConfig from './config/ConditionConfig';

interface NodeConfigPanelProps {
  node: Node;
  onClose: () => void;
}

export default function NodeConfigPanel({ node, onClose }: NodeConfigPanelProps) {
  const renderConfig = () => {
    switch (node.type) {
      case 'approvalNode':
        return <ApprovalConfig node={node} />;
      case 'emailNode':
        return <EmailConfig node={node} />;
      case 'formNode':
        return <FormConfig node={node} />;
      case 'notificationNode':
        return <NotificationConfig node={node} />;
      case 'conditionNode':
        return <ConditionConfig node={node} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <h3 className="text-lg font-medium">Configure Node</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          icon={<X className="h-4 w-4" />}
        />
      </div>
      
      <div className="space-y-6">
        {renderConfig()}
      </div>
    </div>
  );
} 