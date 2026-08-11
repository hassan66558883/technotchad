"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/dictionaries";

type Status = "idle" | "submitting" | "success" | "error";

export default function RegistrationForm({
  type,
  slug,
  dict,
}: {
  type: "course" | "workshop";
  slug: string;
  dict: Dictionary["pages"]["registrationForm"];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedLabel, setConfirmedLabel] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug, ...data }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(body?.error ?? dict.defaultError);
        setStatus("error");
        return;
      }

      setConfirmedLabel(body?.label ?? "");
      form.reset();
      setStatus("success");
    } catch {
      setErrorMessage(dict.networkError);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-emerald-50 p-8 text-center">
        <span className="text-3xl">✅</span>
        <h2 className="mt-3 text-lg font-semibold text-navy">
          {dict.successTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          {confirmedLabel
            ? dict.successTextWithLabel.replace("{label}", confirmedLabel)
            : dict.successTextNoLabel}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-7 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          name="firstName"
          required
          minLength={2}
          className="rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
          placeholder={dict.firstName}
        />
        <input
          name="lastName"
          required
          minLength={2}
          className="rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
          placeholder={dict.lastName}
        />
        <input
          name="phone"
          required
          minLength={6}
          className="rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
          placeholder={dict.phone}
        />
        <input
          name="email"
          required
          type="email"
          className="rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
          placeholder={dict.email}
        />
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 w-full rounded-full bg-blue px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? dict.submitting : dict.submit}
      </button>
    </form>
  );
}
