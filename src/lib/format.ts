export function parsePriceToNumber(price: string): number | null {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}
