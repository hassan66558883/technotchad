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
    connectionTimeoutMillis: 10_000,
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

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pool;
}
