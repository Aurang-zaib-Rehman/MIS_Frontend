import React from "react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { DownloadIcon, PencilIcon } from "@/icons";
import type { StudentProfileData } from "@/services/studentService";

interface StudentProfileHeaderProps {
  profile: StudentProfileData | null;
  onEditClick: () => void;
  onPrintClick: () => void;
}

export const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({
  profile,
  onEditClick,
  onPrintClick,
}) => {
  const isEnrolled = Boolean(profile?.academic?.isAssigned);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 shadow-xs dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative size-20 overflow-hidden rounded-2xl border-2 border-brand-500/30 bg-gray-100 ring-4 ring-brand-500/10 dark:bg-gray-800">
            <img
              src="/images/user/owner.png"
              alt={profile?.fullName || "Student Avatar"}
              className="size-full object-cover"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile?.fullName || "Student User"}
              </h2>
              <Badge color="success" size="sm">
                {profile?.role || "STUDENT"}
              </Badge>
              {isEnrolled ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Enrolled
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  Admission Pending
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {profile?.email} &bull; Jamia Madrassa Uloom-e-Islamia
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            className="inline-flex items-center gap-1.5"
          >
            <PencilIcon className="size-4" />
            <span>Edit Profile</span>
          </Button>
          <Button
            size="sm"
            onClick={onPrintClick}
            className="inline-flex items-center gap-1.5"
          >
            <DownloadIcon className="size-4" />
            <span>Print Student ID Card</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileHeader;
