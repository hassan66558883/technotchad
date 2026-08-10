"use client";

import { useTransition } from "react";
import { markAttendance } from "@/app/admin/(dashboard)/presences/actions";

export default function AttendanceToggle({
  registrationId,
  courseSessionId,
  date,
  present,
}: {
  registrationId: string;
  courseSessionId: string;
  date: string;
  present: boolean | null;
}) {
  const [isPending, startTransition] = useTransition();

  function set(value: boolean) {
    startTransition(() => markAttendance(registrationId, courseSessionId, date, value));
  }

  return (
    <div className="inline-flex overflow-hidden rounded-full border border-line">
      <button
        type="button"
        disabled={isPending}
        onClick={() => set(true)}
        className={`px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
          present === true ? "bg-emerald-500 text-white" : "bg-white text-slate hover:bg-mist"
        }`}
      >
        Présent
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => set(false)}
        className={`px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
          present === false ? "bg-red-500 text-white" : "bg-white text-slate hover:bg-mist"
        }`}
      >
        Absent
      </button>
    </div>
  );
}
