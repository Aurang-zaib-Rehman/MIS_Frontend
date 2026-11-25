import React from "react";

export const StudentEnrollmentNotice: React.FC = () => {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="flex items-start gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-bold">
          !
        </span>
        <div>
          <h4 className="font-bold text-amber-900 dark:text-amber-200">
            Academic Enrollment Pending Assignment
          </h4>
          <p className="mt-1 text-amber-800 dark:text-amber-300 leading-relaxed">
            Your student user account is verified in PostgreSQL. Your institutional academic details
            (Darja, Department, Admission Roll Number, and Monthly Fee) will appear here once officially
            assigned by the Madrassa Administration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentNotice;
