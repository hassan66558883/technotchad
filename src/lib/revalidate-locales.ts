import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/config";

export function revalidatePublicPath(path: string) {
  for (const locale of locales) {
    revalidatePath(`/${locale}${path}`);
  }
}
