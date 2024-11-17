import { Node } from 'reactflow';
import { useWorkflow } from '../../../contexts/WorkflowContext';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';

interface ConditionConfigProps {
  node: Node;
}

interface Condition {
  field: string;
  operator: string;
  value: string;
}

export default function ConditionConfig({ node }: ConditionConfigProps) {
  const { updateNodeData } = useWorkflow();

  const conditions: Condition[] = node.data?.conditions || [];

  const addCondition = () => {
    const newConditions = [
      ...conditions,
      { field: '', operator: 'equals', value: '' },
    ];
    updateNodeData(node.id, { conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    updateNodeData(node.id, { conditions: newConditions });
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = conditions.map((condition, i) => {
      if (i === index) {
        return { ...condition, ...updates };
      }
      return condition;
    });
    updateNodeData(node.id, { conditions: newConditions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Condition Name
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={node.data?.name || ''}
          onChange={(e) => updateNodeData(node.id, { name: e.target.value })}
          placeholder="e.g., Budget Check"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Conditions
          </label>
          <Button
            size="sm"
            variant="ghost"
            onClick={addCondition}
            icon={<PlusCircle className="h-4 w-4" />}
          >
            Add
          </Button>
        </div>

        {conditions.map((condition, index) => (
          <div key={index} className="space-y-2 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Condition {index + 1}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeCondition(index)}
                icon={<Trash2 className="h-4 w-4 text-red-500" />}
              />
            </div>

            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={condition.field}
              onChange={(e) => updateCondition(index, { field: e.target.value })}
            >
              <option value="">Select field</option>
              <option value="amount">Amount</option>
              <option value="department">Department</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>

            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={condition.operator}
              onChange={(e) => updateCondition(index, { operator: e.target.value })}
            >
              <option value="equals">Equals</option>
              <option value="not_equals">Not Equals</option>
              <option value="greater_than">Greater Than</option>
              <option value="less_than">Less Than</option>
              <option value="contains">Contains</option>
            </select>

            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={condition.value}
              onChange={(e) => updateCondition(index, { value: e.target.value })}
              placeholder="Value"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Branch Labels
        </label>
        <div className="mt-2 space-y-2">
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={node.data?.trueLabel || ''}
            onChange={(e) => updateNodeData(node.id, { trueLabel: e.target.value })}
            placeholder="True branch label (e.g., Approved)"
          />
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={node.data?.falseLabel || ''}
            onChange={(e) => updateNodeData(node.id, { falseLabel: e.target.value })}
            placeholder="False branch label (e.g., Rejected)"
          />
        </div>
      </div>
    </div>
  );
} 