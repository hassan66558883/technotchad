export function buildVerifyUrl(certificateNumber: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}/verify/${certificateNumber}`;
}

export function buildCertificateNumber(year: number, sequence: number) {
  return `TT-CERT-${year}-${String(sequence).padStart(6, "0")}`;
}

export function buildInscriptionNumber(year: number, sequence: number) {
  return `INSC-${year}-${String(sequence).padStart(5, "0")}`;
}

export function buildInscriptionVerifyUrl(inscriptionNumber: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}/verify-inscription/${inscriptionNumber}`;
}

export function buildStudentNumber(year: number, sequence: number) {
  return `ETU-${year}-${String(sequence).padStart(5, "0")}`;
}
