export type CollaboratorDocumentType = "quote" | "invoice";

export interface CollaboratorDocumentClient {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
}

export interface CollaboratorDocumentItem {
  description?: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  total?: number;
}

export interface CollaboratorDocumentPayload {
  type: CollaboratorDocumentType;
  reference?: string;
  client?: CollaboratorDocumentClient;
  service_date?: string;
  items?: CollaboratorDocumentItem[];
  subtotal?: number;
  vat_rate?: number;
  vat_amount?: number;
  total_amount?: number;
  payment_terms?: string;
  notes?: string;
}
