export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}