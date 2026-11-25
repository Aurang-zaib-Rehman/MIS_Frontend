import React from "react";
import type { StudentAcademicRecord } from "@/services/studentService";

interface StudentAcademicDetailsCardProps {
  academic: StudentAcademicRecord | undefined;
}

export const StudentAcademicDetailsCard: React.FC<StudentAcademicDetailsCardProps> = ({
  academic,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 shadow-xs dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          Institutional Academic Record (Admin Managed)
        </h3>
        <span className="text-[11px] text-gray-400">
          Managed by Madrassa Administration
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Enrolled Department
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {academic?.department || (
              <span className="italic text-gray-400">Not assigned yet</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Enrolled Darja (Class)
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {academic?.darja || (
              <span className="italic text-gray-400">Not assigned yet</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Institutional Roll Number
          </p>
          <p className="mt-1 text-sm font-mono font-semibold text-brand-600 dark:text-brand-400">
            {academic?.rollNo || (
              <span className="italic font-sans text-gray-400">Not assigned yet</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Admission Date
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {academic?.admissionDate || (
              <span className="italic text-gray-400">Not assigned yet</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            CNIC / B-Form Number
          </p>
          <p className="mt-1 text-sm font-mono font-semibold text-gray-900 dark:text-white">
            {academic?.cnicFormB || (
              <span className="italic font-sans text-gray-400">Not assigned yet</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Assigned Monthly Fee
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {academic?.monthlyFee !== null && academic?.monthlyFee !== undefined ? (
              `PKR ${academic.monthlyFee.toLocaleString()}`
            ) : (
              <span className="italic text-gray-400">Not assigned yet</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicDetailsCard;
