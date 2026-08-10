"use client";

import { useState, type FormEvent } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const serviceOptions = [
  "Site web",
  "Réseau",
  "CCTV",
  "PBX",
  "ERP",
  "Formation",
  "Maintenance",
  "Autre",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactCta() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setErrorMessage(body?.error ?? "Une erreur est survenue. Merci de réessayer.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setErrorMessage("Impossible d'envoyer votre demande. Vérifiez votre connexion.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 bg-navy py-20 text-white sm:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Parlons de votre projet"
            description="Décrivez-nous votre besoin, notre équipe vous recontacte sous 24h."
            align="left"
            dark
          />

          <div className="mt-10 space-y-4 text-sm text-white/70">
            <p>📍 N&apos;Djaména – Tchad</p>
            <p>📞 60 98 48 49 &nbsp;/&nbsp; 90 98 48 49</p>
            <p>✉️ contact@technotchad.com</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              name="name"
              required
              minLength={2}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder-white/40 outline-none focus:border-cyan"
              placeholder="Nom complet"
            />
            <input
              name="company"
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder-white/40 outline-none focus:border-cyan"
              placeholder="Entreprise"
            />
            <input
              name="phone"
              required
              minLength={6}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder-white/40 outline-none focus:border-cyan"
              placeholder="Téléphone"
            />
            <input
              name="email"
              required
              type="email"
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder-white/40 outline-none focus:border-cyan"
              placeholder="Email"
            />
            <select
              name="serviceType"
              required
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70 outline-none focus:border-cyan [&>option]:text-navy"
              defaultValue=""
            >
              <option value="" disabled>
                Type de service
              </option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              name="budget"
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder-white/40 outline-none focus:border-cyan"
              placeholder="Budget estimé"
            />
          </div>
          <textarea
            name="message"
            required
            minLength={10}
            className="mt-4 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm placeholder-white/40 outline-none focus:border-cyan"
            rows={4}
            placeholder="Message"
          />

          {status === "success" && (
            <p className="mt-4 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
              Votre demande a bien été envoyée. Notre équipe vous recontacte sous 24h.
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-5 w-full rounded-full bg-cyan px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "ENVOI EN COURS…" : "ENVOYER LA DEMANDE"}
          </button>
        </form>
      </Container>
    </section>
  );
}
