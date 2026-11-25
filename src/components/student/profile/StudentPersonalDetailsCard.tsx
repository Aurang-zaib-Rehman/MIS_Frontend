import React from "react";
import { PencilIcon } from "@/icons";
import type { StudentProfileData } from "@/services/studentService";

interface StudentPersonalDetailsCardProps {
  profile: StudentProfileData | null;
  onEditClick: () => void;
}

export const StudentPersonalDetailsCard: React.FC<StudentPersonalDetailsCardProps> = ({
  profile,
  onEditClick,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 shadow-xs dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          Personal Profile Details
        </h3>
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <PencilIcon className="size-3.5" />
          Edit Personal Info
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Full Name
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {profile?.fullName || (
              <span className="italic text-gray-400">Not provided</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Father / Guardian Name
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {profile?.guardianName || (
              <span className="italic text-gray-400">Not assigned yet</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Email Address
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {profile?.email}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Contact / Phone Number
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {profile?.phoneNumber || (
              <span className="italic text-gray-400">Not provided</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Date of Birth
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {profile?.dateOfBirth || (
              <span className="italic text-gray-400">Not provided</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            User Role
          </p>
          <p className="mt-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
            {profile?.role || "STUDENT"} (Student Self-Service)
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Residential / Current Address
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {profile?.address || (
              <span className="italic text-gray-400">Not provided</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentPersonalDetailsCard;
