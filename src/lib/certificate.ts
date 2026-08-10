export function buildVerifyUrl(certificateNumber: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}/verify/${certificateNumber}`;
}

export function buildCertificateNumber(year: number, sequence: number) {
  return `CERT-${year}-${String(sequence).padStart(5, "0")}`;
}

export function buildInscriptionNumber(year: number, sequence: number) {
  return `INSC-${year}-${String(sequence).padStart(5, "0")}`;
}

export function buildInscriptionVerifyUrl(inscriptionNumber: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}/verify-inscription/${inscriptionNumber}`;
}
