-- Schéma Supabase pour Premium Solution
-- À exécuter dans le SQL editor Supabase (extension pgcrypto requise).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table pour les devis (quotes)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE NOT NULL,

  -- Informations client
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_address TEXT,

  -- Type de client (gerances, entreprise, particulier)
  client_type TEXT NOT NULL CHECK (client_type IN ('gerances', 'entreprise', 'particulier')),

  -- Détails du service
  service_type TEXT NOT NULL,
  service_frequency TEXT,
  surface_area NUMERIC,
  location TEXT,
  details JSONB,

  -- Montants
  subtotal NUMERIC(10,2),
  tax_rate NUMERIC(5,2) DEFAULT 8.1,
  tax_amount NUMERIC(10,2),
  total_amount NUMERIC(10,2) NOT NULL,

  -- Fichier PDF
  pdf_url TEXT,
  pdf_filename TEXT,

  -- Statut et dates
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  valid_until DATE,

  -- Métadonnées
  metadata JSONB
);

-- Table pour les factures (invoices)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  quote_id UUID REFERENCES quotes(id),

  -- Informations client
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_address TEXT,

  -- Lignes de facturation
  items JSONB NOT NULL,

  -- Montants
  subtotal NUMERIC(10,2) NOT NULL,
  tax_rate NUMERIC(5,2) DEFAULT 8.1,
  tax_amount NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,

  -- Fichier PDF
  pdf_url TEXT,
  pdf_filename TEXT,

  -- Paiement
  payment_terms TEXT DEFAULT '30 jours net',
  due_date DATE,
  paid_at TIMESTAMP,
  payment_method TEXT,

  -- Statut
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Métadonnées
  metadata JSONB
);

-- Table pour les conversations chatbot
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL,
  quote_id UUID REFERENCES quotes(id),
  collected_data JSONB,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  search_vector tsvector
);

-- Table pour les contacts (formulaire de contact)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  replied_at TIMESTAMP
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(client_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_quote_id ON invoices(quote_id);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_status ON chat_conversations(status);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_updated_at BEFORE UPDATE ON chat_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function pour générer numéro de devis
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT := TO_CHAR(NOW(), 'YYYY');
  count INTEGER;
  new_number TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO count
  FROM quotes
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());

  new_number := 'DEV-' || year || '-' || LPAD(count::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function pour générer numéro de facture
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT := TO_CHAR(NOW(), 'YYYY');
  count INTEGER;
  new_number TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO count
  FROM invoices
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());

  new_number := 'FAC-' || year || '-' || LPAD(count::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies (tout le monde peut créer, seul le service_role peut lire/modifier)
CREATE POLICY "Allow insert for all" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all" ON chat_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert for all" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Storage bucket pour les PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policies storage
CREATE POLICY "Allow upload for authenticated" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Allow read for all" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
