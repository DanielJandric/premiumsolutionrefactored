"use client";

import { useTransition, useState } from "react";
import type { QuoteRequestRecord } from "@/lib/quotes/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { finalizeQuoteAction, updateQuoteRequestStatusAction, type FinalizeQuoteForm } from "@/app/collaborateurs/demandes/actions";
import { cn } from "@/lib/utils";

interface QuoteFinalizeFormProps {
  request: QuoteRequestRecord;
}

type FormItem = {
  id: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
};

const VAT_DEFAULT = 0.081;

export function QuoteFinalizeForm({ request }: QuoteFinalizeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<{
    reference: string;
    serviceDate: string;
    paymentTerms: string;
    notes: string;
    finalizedBy: string;
    vatRate: number;
    items: FormItem[];
    error?: string;
    success?: boolean;
  }>(() => ({
    reference: request.requestNumber ?? `DEMANDE-${request.id.slice(0, 8)}`,
    serviceDate: "",
    paymentTerms: "Paiement à 30 jours net",
    notes: request.notes ?? "",
    finalizedBy: "",
    vatRate: VAT_DEFAULT,
    items: [
      {
        id: cryptoId(),
        description: request.serviceType ?? "Prestation Premium Solution",
        quantity: 1,
        unit: "unité",
        unitPrice: 0,
      },
    ],
  }));

  const subtotal = formState.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = subtotal * formState.vatRate;
  const totalAmount = subtotal + vatAmount;

  const updateStatus = (status: "pending" | "in_review") => {
    startTransition(async () => {
      await updateQuoteRequestStatusAction(request.id, status);
    });
  };

  const addItem = () => {
    setFormState((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: cryptoId(),
          description: "",
          quantity: 1,
          unit: "",
          unitPrice: 0,
        },
      ],
    }));
  };

  const updateItem = (id: string, data: Partial<FormItem>) => {
    setFormState((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...data } : item)),
    }));
  };

  const removeItem = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((item) => item.id !== id) : prev.items,
    }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const payload: FinalizeQuoteForm = {
        requestId: request.id,
        reference: formState.reference,
        serviceDate: formState.serviceDate || undefined,
        paymentTerms: formState.paymentTerms || undefined,
        notes: formState.notes || undefined,
        finalizedBy: formState.finalizedBy || undefined,
        subtotal: Number(subtotal.toFixed(2)),
        vatRate: formState.vatRate,
        totalAmount: Number(totalAmount.toFixed(2)),
        items: formState.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
        })),
      };

      const result = await finalizeQuoteAction(payload);

      if (result.success) {
        setFormState((prev) => ({ ...prev, success: true, error: undefined }));
      } else {
        setFormState((prev) => ({ ...prev, success: false, error: "Validation impossible. Merci de vérifier le formulaire." }));
      }
    });
  };

  return (
    <div className="space-y-6 rounded-3xl border border-border/70 bg-card/95 p-6 shadow-xl shadow-primary/10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Finaliser le devis</h2>
          <p className="text-sm text-muted-foreground">
            Ajustez les lignes de prestations, les montants et les notes avant de générer le PDF envoyé au client.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => updateStatus("pending")} disabled={isPending}>
            Marquer en attente
          </Button>
          <Button type="button" variant="secondary" onClick={() => updateStatus("in_review")} disabled={isPending}>
            Marquer en revue
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Référence" required>
              <Input
                value={formState.reference}
                onChange={(event) => setFormState((prev) => ({ ...prev, reference: event.target.value }))}
              />
            </Field>
            <Field label="Date de prestation">
              <Input
                value={formState.serviceDate}
                placeholder="JJ/MM/AAAA"
                onChange={(event) => setFormState((prev) => ({ ...prev, serviceDate: event.target.value }))}
              />
            </Field>
          </div>

          <div className="space-y-3">
            {formState.items.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 sm:grid-cols-[2fr,1fr,1fr,auto]">
                <Field label={`Ligne ${index + 1}`}>
                  <Input
                    value={item.description}
                    onChange={(event) => updateItem(item.id, { description: event.target.value })}
                    placeholder="Description"
                  />
                </Field>
                <Field label="Quantité">
                  <Input
                    value={item.quantity}
                    type="number"
                    min={0}
                    step="1"
                    onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) || 0 })}
                  />
                </Field>
                <Field label="Unité">
                  <Input
                    value={item.unit ?? ""}
                    onChange={(event) => updateItem(item.id, { unit: event.target.value })}
                    placeholder="ex. heure"
                  />
                </Field>
                <Field label="Prix unitaire (CHF)">
                  <Input
                    value={item.unitPrice}
                    type="number"
                    min={0}
                    step="0.05"
                    onChange={(event) => updateItem(item.id, { unitPrice: Number(event.target.value) || 0 })}
                  />
                </Field>
                <div className="sm:col-span-4 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => removeItem(item.id)}
                    disabled={formState.items.length === 1 || isPending}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} disabled={isPending}>
              Ajouter une ligne
            </Button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm">
            <h3 className="font-semibold text-foreground">Montants</h3>
            <div className="mt-3 space-y-2">
              <AmountRow label="Sous-total" value={subtotal.toFixed(2)} />
              <div className="flex items-center justify-between gap-3">
                <span>TVA (%)</span>
                <Input
                  className="w-24 text-right"
                  value={(formState.vatRate * 100).toFixed(2)}
                  type="number"
                  min={0}
                  step="0.01"
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, vatRate: Number(event.target.value) / 100 }))
                  }
                />
              </div>
              <AmountRow label="Montant TVA" value={vatAmount.toFixed(2)} />
              <AmountRow label="Total" value={totalAmount.toFixed(2)} highlight />
            </div>
          </div>

          <Field label="Conditions de paiement">
            <Textarea
              value={formState.paymentTerms}
              rows={2}
              onChange={(event) => setFormState((prev) => ({ ...prev, paymentTerms: event.target.value }))}
            />
          </Field>

          <Field label="Notes / remarques">
            <Textarea
              value={formState.notes}
              rows={3}
              onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </Field>

          <Field label="Collaborateur en charge">
            <Input
              value={formState.finalizedBy}
              onChange={(event) => setFormState((prev) => ({ ...prev, finalizedBy: event.target.value }))}
              placeholder="Nom et prénom"
            />
          </Field>

          {formState.error ? (
            <p className="text-sm text-destructive">{formState.error}</p>
          ) : formState.success ? (
            <p className="text-sm text-primary">Le devis a été généré et stocké dans Supabase.</p>
          ) : null}

          <Button type="button" className="w-full" onClick={handleSubmit} disabled={isPending}>
            Générer le devis PDF
          </Button>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("space-y-2 text-sm", className)}>
      <span className="block text-foreground">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function AmountRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between", highlight ? "text-lg font-semibold" : undefined)}>
      <span>{label}</span>
      <span>{value} CHF</span>
    </div>
  );
}

function cryptoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
