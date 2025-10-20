"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Merci d’indiquer votre nom complet."),
  email: z.string().email("Adresse email invalide."),
  phone: z.string().optional(),
  subject: z.string().min(2, "Sujet requis."),
  message: z.string().min(10, "Message minimum 10 caractères."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSubmit?: (values: ContactFormValues) => Promise<void> | void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const parseResult = contactSchema.safeParse({
      name: values.name,
      email: values.email,
      phone: values.phone,
      subject: values.subject,
      message: values.message,
    });

    if (!parseResult.success) {
      setError(parseResult.error.issues[0]?.message ?? "Erreur de validation.");
      setSuccess(null);
      return;
    }

    if (!onSubmit) {
      // Mode placeholder : affichage optimiste sans appel serveur.
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
      setSuccess(
        "Merci pour votre message. L’équipe Premium Solution vous contactera rapidement.",
      );
      (event.currentTarget as HTMLFormElement).reset();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(parseResult.data);
      setSuccess(
        "Merci pour votre message. L’équipe Premium Solution vous contactera rapidement.",
      );
      (event.currentTarget as HTMLFormElement).reset();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Une erreur est survenue. Merci de réessayer.",
      );
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl shadow-primary/5 backdrop-blur"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nom complet
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Votre nom"
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="vous@exemple.ch"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Téléphone (optionnel)
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+41 ..."
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium text-foreground">
            Sujet
          </label>
          <Input
            id="subject"
            name="subject"
            placeholder="Sujet de votre demande"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Présentez votre besoin en quelques lignes..."
          rows={5}
          required
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-muted-foreground">
          Premium Solution répond sous 24 h ouvrables. Pour une demande urgente, contactez-nous
          directement au +41 76 639 36 53.
        </p>
        <Button type="submit" disabled={loading} className="min-w-[200px]">
          {loading ? "Envoi en cours..." : "Envoyer ma demande"}
        </Button>
      </div>

      {error ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="text-sm font-medium text-primary">
          {success}
        </p>
      ) : null}
    </form>
  );
}
