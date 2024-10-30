export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Option[]; // Ensure this is an array of Option objects
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Option {
  label: string;
  value: string;
  checked: boolean;
}