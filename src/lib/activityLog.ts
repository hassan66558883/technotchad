import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  return session?.sub ?? null;
}

export async function logActivity(params: {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string | null;
}) {
  try {
    const userId = params.userId !== undefined ? params.userId : await getCurrentUserId();
    await prisma.activityLog.create({
      data: {
        userId: userId ?? undefined,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
      },
    });
  } catch (error) {
    console.error("[activityLog] Failed to record entry:", error);
  }
}
