import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 56,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  logo: { width: 130, alignSelf: "center", marginBottom: 10 },
  country: { textAlign: "center", fontSize: 13, fontFamily: "Helvetica-Bold" },
  motto: { textAlign: "center", fontSize: 9, fontFamily: "Helvetica-Oblique", marginTop: 2 },
  institution: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 18,
  },
  address: { textAlign: "center", fontSize: 9, marginTop: 4, color: "#374151" },
  rule: { borderBottomWidth: 1, borderBottomColor: "#111827", marginTop: 16, marginBottom: 16 },
  refRow: { flexDirection: "row", justifyContent: "flex-end" },
  refText: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginTop: 24,
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  body: { fontSize: 11.5, lineHeight: 1.7, textAlign: "justify" },
  bold: { fontFamily: "Helvetica-Bold" },
  closing: { fontSize: 11, lineHeight: 1.7, textAlign: "justify", marginTop: 16 },
  dateLine: { fontSize: 11, marginTop: 28 },
  signatureBlock: { alignItems: "flex-end", marginTop: 36 },
  signatureLabel: { fontSize: 10.5 },
  signatureName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 30 },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  qr: { width: 70, height: 70 },
  qrCaption: { fontSize: 7, color: "#6b7280", marginTop: 3, textAlign: "center", width: 70 },
  verifyUrl: { fontSize: 8, color: "#6b7280" },
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
    issuedAt,
    qrCodeDataUri,
    verifyUrl,
    status,
  } = props;

  const pronoun = gender === "F" ? "Elle" : "Il";
  const bornSuffix = gender === "F" ? "née" : "né(e)";
  const programLine = trainingDetail ? `${programTitle} (${trainingDetail})` : programTitle;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {status === "REVOKED" && (
          <Text
            style={{
              position: "absolute",
              top: 260,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 46,
              color: "#dc2626",
              opacity: 0.25,
              transform: "rotate(-25deg)",
              fontFamily: "Helvetica-Bold",
            }}
          >
            ANNULÉ / CANCELLED
          </Text>
        )}

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

        <Text style={styles.body}>
          Je soussigné Mr HASSAN ISMAIL NASSOUR, Directeur Général du Centre de formation d&apos;informatique
          Et d&apos;apprentissage des langues, atteste que le nommé(e){" "}
          <Text style={styles.bold}>{studentFullName}</Text>, {bornSuffix} le {formatDate(dateOfBirth)}
          {placeOfBirth ? ` à ${placeOfBirth}` : ""}, a suivi avec succès la formation en{" "}
          <Text style={styles.bold}>{programLine}</Text> au sein de notre centre. Du{" "}
          <Text style={styles.bold}>{formatDate(trainingStartDate)}</Text> au{" "}
          <Text style={styles.bold}>{formatDate(trainingEndDate)}</Text>. {pronoun} a fini le programme avec
          succès.
        </Text>

        <Text style={styles.closing}>
          En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.
        </Text>

        <Text style={styles.dateLine}>Fait à N&apos;Djamena, le {formatDate(issuedAt)}.</Text>

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>Le Directeur Général</Text>
          <Text style={styles.signatureName}>HASSAN ISMAIL NASSOUR</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.verifyUrl}>{verifyUrl}</Text>
          {qrCodeDataUri && (
            <View>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={qrCodeDataUri} style={styles.qr} />
              <Text style={styles.qrCaption}>Scannez pour vérifier</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
