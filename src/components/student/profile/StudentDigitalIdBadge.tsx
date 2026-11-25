import React from "react";
import type { StudentProfileData } from "@/services/studentService";

interface StudentDigitalIdBadgeProps {
  profile: StudentProfileData | null;
}

export const StudentDigitalIdBadge: React.FC<StudentDigitalIdBadgeProps> = ({
  profile,
}) => {
  const academic = profile?.academic;
  const isEnrolled = Boolean(academic?.isAssigned);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 shadow-xs dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          Official Student ID Badge
        </h3>
        <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
          VERIFIED ID
        </span>
      </div>

      {/* Smart ID Card Simulation */}
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-2 border-brand-500/40 bg-linear-to-br from-white via-brand-50/20 to-emerald-50/30 p-5 shadow-md dark:border-brand-500/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Top Header */}
        <div className="border-b border-gray-200 pb-3 text-center dark:border-gray-700">
          <p className="text-[10px] font-bold text-brand-700 dark:text-brand-300">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
          </p>
          <h4 className="mt-0.5 text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
            JAMIA MADRASSA ULOOM-E-ISLAMIA
          </h4>
          <p className="text-[9px] text-gray-500 dark:text-gray-400">
            Affiliated with Wifaq-ul-Madaris Al-Arabia Pakistan
          </p>
          <div className="mt-1.5 inline-block rounded-md bg-brand-600 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            STUDENT IDENTITY CARD &bull; بطاقة الطالب
          </div>
        </div>

        {/* Card Body */}
        <div className="mt-4 flex items-start gap-4">
          <div className="shrink-0 text-center">
            <div className="size-20 overflow-hidden rounded-xl border-2 border-brand-500/40 shadow-xs">
              <img
                src="/images/user/owner.png"
                alt={profile?.fullName || "Student"}
                className="size-full object-cover"
              />
            </div>
            <span className="mt-1.5 inline-block rounded-sm bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {profile?.role || "STUDENT"}
            </span>
          </div>

          <div className="flex-1 space-y-1 text-xs">
            <h5 className="font-bold text-gray-900 dark:text-white">
              {profile?.fullName || "Not provided"}
            </h5>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              S/O:{" "}
              <strong className="text-gray-800 dark:text-gray-200">
                {profile?.guardianName || (
                  <span className="italic font-normal text-gray-400">Not assigned yet</span>
                )}
              </strong>
            </p>
            <div className="space-y-1 pt-1 text-[11px]">
              <div className="flex justify-between border-b border-gray-100 pb-0.5 dark:border-gray-800">
                <span className="text-gray-500">Roll No:</span>
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                  {academic?.rollNo || (
                    <span className="italic font-normal text-gray-400">Not assigned yet</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5 dark:border-gray-800">
                <span className="text-gray-500">Darja / Class:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {academic?.darja || (
                    <span className="italic font-normal text-gray-400">Not assigned yet</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-0.5 dark:border-gray-800">
                <span className="text-gray-500">Department:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {academic?.department || (
                    <span className="italic font-normal text-gray-400">Not assigned yet</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Admission No:</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {academic?.studentId ? `ADM-${academic.studentId}` : (
                    <span className="italic text-gray-400">Not assigned yet</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-[10px] dark:border-gray-700">
          <div>
            <p className="font-mono font-bold tracking-widest text-gray-700 dark:text-gray-300">
              |||| || ||| ||||| |||
            </p>
            <span className="text-[9px] text-gray-400">
              UID: {profile?.userId ? String(profile.userId).padStart(6, "0") : "000000"}
            </span>
          </div>
          <div className="text-end">
            <span className="block text-[9px] text-gray-400">Status:</span>
            <strong className="text-emerald-600 dark:text-emerald-400">
              {isEnrolled ? "Active Enrolled" : "Registered"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDigitalIdBadge;
