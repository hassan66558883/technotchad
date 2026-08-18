import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const NAVY = "#1c2a4a";
const GOLD = "#b8860b";

const styles = StyleSheet.create({
  page: {
    padding: 22,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  outerBorder: {
    flex: 1,
    borderWidth: 3,
    borderColor: NAVY,
    padding: 6,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: GOLD,
    padding: 22,
    position: "relative",
  },
  logo: { width: 76, height: 76, alignSelf: "center", marginBottom: 4, objectFit: "contain" },
  country: { textAlign: "center", fontSize: 14, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
  motto: { textAlign: "center", fontSize: 9, fontFamily: "Helvetica-Oblique", marginTop: 2, color: "#374151" },
  institution: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
    color: NAVY,
  },
  address: { textAlign: "center", fontSize: 8.5, marginTop: 2, color: "#4b5563" },
  rule: { borderBottomWidth: 1, borderBottomColor: "#d1d5db", marginTop: 8, marginBottom: 3 },
  refRow: { flexDirection: "row", justifyContent: "flex-end" },
  refText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: NAVY },
  title: {
    textAlign: "center",
    fontSize: 19,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: NAVY,
  },
  bodyWrap: { alignItems: "center" },
  body: { fontSize: 10.5, lineHeight: 1.5, textAlign: "justify", width: "80%" },
  bold: { fontFamily: "Helvetica-Bold" },
  closing: { fontSize: 10, lineHeight: 1.5, textAlign: "justify", width: "80%", marginTop: 8 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 14,
  },
  qrBlock: { alignItems: "center" },
  qr: { width: 50, height: 50 },
  qrCaption: { fontSize: 6.5, color: "#6b7280", marginTop: 2, textAlign: "center", width: 62 },
  verifyUrl: { fontSize: 7, color: "#6b7280", marginTop: 3, textAlign: "center" },
  dateLine: { fontSize: 10, marginBottom: 4, textAlign: "center" },
  signatureBlock: { alignItems: "center", width: 190 },
  signatureLine: {
    width: 110,
    borderBottomWidth: 1,
    borderBottomColor: "#9ca3af",
    marginTop: 18,
    marginBottom: 4,
  },
  signatureLabel: { fontSize: 10 },
  signatureName: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  watermark: {
    position: "absolute",
    top: "42%",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 40,
    color: "#dc2626",
    opacity: 0.22,
    fontFamily: "Helvetica-Bold",
    transform: "rotate(-22deg)",
  },
});

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(date),
  );
}

export type CertificateDocumentProps = {
  logoDataUri: string;
  certificateNumber: string;
  studentFullName: string;
  dateOfBirth: Date | string | null;
  placeOfBirth: string | null;
  gender: string | null;
  programTitle: string;
  trainingDetail: string | null;
  trainingStartDate: Date | string | null;
  trainingEndDate: Date | string | null;
  instructorName: string | null;
  issuedAt: Date | string;
  qrCodeDataUri: string | null;
  verifyUrl: string;
  status: "ACTIVE" | "REVOKED";
};

export default function CertificateDocument(props: CertificateDocumentProps) {
  const {
    logoDataUri,
    certificateNumber,
    studentFullName,
    dateOfBirth,
    placeOfBirth,
    gender,
    programTitle,
    trainingDetail,
    trainingStartDate,
    trainingEndDate,
    instructorName,
    issuedAt,
    qrCodeDataUri,
    verifyUrl,
    status,
  } = props;

  const pronoun = gender === "F" ? "Elle" : "Il";
  const bornSuffix = gender === "F" ? "née" : "né(e)";
  // Course/workshop descriptions are written for the public catalogue and can run
  // long — the certificate body is a single fixed-size sentence, so it must stay
  // short enough to always fit on one page regardless of description length.
  const MAX_DETAIL_LENGTH = 60;
  const shortDetail =
    trainingDetail && trainingDetail.length > MAX_DETAIL_LENGTH
      ? `${trainingDetail.slice(0, MAX_DETAIL_LENGTH).trimEnd().replace(/[.,;:]+$/, "")}…`
      : trainingDetail?.replace(/\.$/, "") ?? null;
  const programLine = shortDetail ? `${programTitle} (${shortDetail})` : programTitle;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            {status === "REVOKED" && <Text style={styles.watermark}>ANNULÉ / CANCELLED</Text>}

            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={logoDataUri} style={styles.logo} />
            <Text style={styles.country}>RÉPUBLIQUE DU TCHAD</Text>
            <Text style={styles.motto}>UNITÉ – TRAVAIL – PROGRÈS</Text>

            <Text style={styles.institution}>
              CENTRE DE FORMATION D&apos;INFORMATIQUE ET D&apos;APPRENTISSAGE DES LANGUES
            </Text>
            <Text style={styles.address}>
              Quartier Amriguébé à 200m de l&apos;Université Roi Fayçal — Tél : (+235) 60 98 48 49 / 90 98 48 49
            </Text>
            <Text style={styles.address}>
              Email : technotchad@gmail.com / contact@technotchad.com — Site Web : www.technotchad.com
            </Text>

            <View style={styles.rule} />

            <View style={styles.refRow}>
              <Text style={styles.refText}>N° : {certificateNumber}</Text>
            </View>

            <Text style={styles.title}>Attestation de Formation</Text>

            <View style={styles.bodyWrap}>
              <Text style={styles.body}>
                Je soussigné Mr HASSAN ISMAIL NASSOUR, Directeur Général du Centre de formation
                d&apos;informatique Et d&apos;apprentissage des langues, atteste que le nommé(e){" "}
                <Text style={styles.bold}>{studentFullName}</Text>, {bornSuffix} le {formatDate(dateOfBirth)}
                {placeOfBirth ? ` à ${placeOfBirth}` : ""}, a suivi avec succès la formation en{" "}
                <Text style={styles.bold}>{programLine}</Text> au sein de notre centre. Du{" "}
                <Text style={styles.bold}>{formatDate(trainingStartDate)}</Text> au{" "}
                <Text style={styles.bold}>{formatDate(trainingEndDate)}</Text>. {pronoun} a fini le programme
                avec succès.
              </Text>

              <Text style={styles.closing}>
                En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de
                droit.
              </Text>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureLabel}>Le Formateur</Text>
                <View style={styles.signatureLine} />
                {instructorName && <Text style={styles.signatureName}>{instructorName.toUpperCase()}</Text>}
              </View>

              <View style={styles.qrBlock}>
                <Text style={styles.dateLine}>Fait à N&apos;Djamena, le {formatDate(issuedAt)}.</Text>
                {qrCodeDataUri && (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image src={qrCodeDataUri} style={styles.qr} />
                    <Text style={styles.qrCaption}>Scannez pour vérifier</Text>
                  </>
                )}
                <Text style={styles.verifyUrl}>{verifyUrl}</Text>
              </View>

              <View style={styles.signatureBlock}>
                <Text style={styles.signatureLabel}>Le Directeur Général</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>HASSAN ISMAIL NASSOUR</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
