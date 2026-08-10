"use client";

import { useTransition } from "react";

export default function DeleteButton({
  action,
  confirmText = "Supprimer cet élément ?",
}: {
  action: () => Promise<void>;
  confirmText?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (window.confirm(confirmText)) {
          startTransition(() => action());
        }
      }}
      className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Suppression…" : "Supprimer"}
    </button>
  );
}
