export type StudentStatus = "NOUVEAU" | "ANCIEN";

// A student becomes "Ancien" (returning) once they have more than one
// registration — i.e. they came back for a second course/workshop after
// their first. Otherwise they're "Nouveau" (new).
export function getStudentStatus(registrationCount: number): StudentStatus {
  return registrationCount > 1 ? "ANCIEN" : "NOUVEAU";
}

export const studentStatusLabels: Record<StudentStatus, string> = {
  NOUVEAU: "Nouveau",
  ANCIEN: "Ancien",
};

export const studentStatusStyles: Record<StudentStatus, string> = {
  NOUVEAU: "bg-blue/10 text-blue",
  ANCIEN: "bg-emerald-100 text-emerald-700",
};
