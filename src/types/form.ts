export type FieldType = 'text' | 'checkbox' | 'radio' | 'select' | 'date' | 'file';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  status: 'draft' | 'finalized' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface FormResponse {
  id: string;
  formTitle: string;
  formId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  data: Record<string, any>;
  comments?: string;
  fields?: FormField[];
}