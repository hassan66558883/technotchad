import { prisma } from "@/lib/prisma";
import QuoteStatusSelect from "@/components/admin/QuoteStatusSelect";

export const metadata = { title: "Demandes de devis — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function DemandesDevisPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-navy">
            Demandes de devis
          </h1>
          <p className="text-sm text-slate">
            {quotes.length} demande{quotes.length > 1 ? "s" : ""} reçue
            {quotes.length > 1 ? "s" : ""} via le formulaire du site.
          </p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            Aucune demande de devis pour le moment. Les soumissions du
            formulaire de contact du site apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-2xl border border-line bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-navy">
                    {quote.name}
                    {quote.company && (
                      <span className="font-normal text-slate"> — {quote.company}</span>
                    )}
                  </h2>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate">
                    <span>📞 {quote.phone}</span>
                    <span>✉️ {quote.email}</span>
                    <span className="font-semibold text-blue">
                      {quote.serviceType}
                    </span>
                    {quote.budget && <span>💰 {quote.budget}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate/70">
                    {formatDate(quote.createdAt)}
                  </span>
                  <QuoteStatusSelect id={quote.id} status={quote.status} />
                </div>
              </div>

              <p className="mt-4 rounded-lg bg-mist p-4 text-sm leading-relaxed text-ink">
                {quote.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
