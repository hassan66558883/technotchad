import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; pgPool?: Pool };

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 10,
    idleTimeoutMillis: 60_000,
    connectionTimeoutMillis: 30_000,
  });

// Required: the `pg` Pool emits 'error' on idle clients that the remote
// server (Prisma Postgres) closes unilaterally. Without a listener, that
// error is unhandled and can crash/cascade into unrelated in-flight
// queries. Losing the connection is expected with a hosted pooler; the
// Pool transparently opens a new one on the next query.
if (!globalForPrisma.pgPool) {
  pool.on("error", (err) => {
    console.error("[pg pool] idle client error (connection recycled):", err.message);
  });
}

const adapter = new PrismaPg(pool);

const basePrisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
  globalForPrisma.pgPool = pool;
}

// Retry transient connection failures (e.g. a brief network blip between the
// build/server host and the hosted Postgres) for read operations only.
// Mutations are never retried here: if the write actually reached the server
// before the connection dropped, blindly retrying could create a duplicate
// record (double payment, double certificate, etc).
const RETRYABLE_READ_OPERATIONS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

const RETRYABLE_ERROR_CODES = new Set(["P1001", "P1002", "P1008", "P1017"]);
const RETRYABLE_ERROR_PATTERNS = [
  "connection terminated",
  "econnreset",
  "etimedout",
  "failed to connect to upstream database",
  "connection timeout",
];

function isRetryableError(error: unknown) {
  const code = (error as { code?: string } | undefined)?.code;
  if (code && RETRYABLE_ERROR_CODES.has(code)) return true;
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return RETRYABLE_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_ATTEMPTS = 3;

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, args, query }) {
        if (!RETRYABLE_READ_OPERATIONS.has(operation)) return query(args);

        let lastError: unknown;
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
          try {
            return await query(args);
          } catch (error) {
            lastError = error;
            if (attempt === MAX_ATTEMPTS || !isRetryableError(error)) throw error;
            console.error(
              `[prisma] retrying ${operation} after transient error (attempt ${attempt}/${MAX_ATTEMPTS}):`,
              error instanceof Error ? error.message : error,
            );
            await delay(300 * 2 ** (attempt - 1));
          }
        }
        throw lastError;
      },
    },
  },
});
