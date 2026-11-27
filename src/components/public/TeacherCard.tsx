import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { TimeIcon } from "@/icons";

export interface TeacherProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification?: string;
  specialty?: string;
  image: string;
  experienceYears: number;
}

interface TeacherCardProps {
  teacher: TeacherProfile;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Teacher profile for ${teacher.name}, ${teacher.designation}`}
      onClick={() => setIsExpanded((prev) => !prev)}
      onBlur={() => setIsExpanded(false)}
      onMouseLeave={() => setIsExpanded(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsExpanded((prev) => !prev);
        }
      }}
      className={`group relative flex h-[310px] sm:h-[320px] w-full flex-col items-center justify-start overflow-hidden rounded-2xl border bg-white px-5 pt-6 pb-5 text-center shadow-theme-xs transition-all duration-300 cursor-pointer select-none dark:bg-gray-900 ${
        isExpanded
          ? "border-brand-400 shadow-theme-md dark:border-brand-600/70"
          : "border-gray-200/90 hover:border-brand-400 hover:shadow-theme-md dark:border-gray-800 dark:hover:border-brand-600/70"
      }`}
    >
      {/* Top Center Teacher Avatar Image:
          Starts large & prominent to fill the card;
          on hover / active it shrinks and translates upward to create space for hidden data */}
      <div
        className={`relative shrink-0 overflow-hidden rounded-full border-4 border-brand-100/90 bg-gray-100 shadow-sm transition-all duration-300 ease-out dark:border-brand-900/40 dark:bg-gray-800 ${
          isExpanded
            ? "size-20 -translate-y-1 border-brand-300"
            : "size-32 sm:size-36 group-hover:size-20 group-hover:-translate-y-1 group-hover:border-brand-300"
        }`}
      >
        <img
          src={teacher.image}
          alt={teacher.name}
          loading="eager"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLImageElement).src = "/images/user/staff.jpeg";
          }}
        />
      </div>

      {/* Teacher Name & Designation:
          Cleanly positioned below the image; lifts smoothly as image shrinks */}
      <div className="mt-3.5 flex flex-col items-center text-center transition-all duration-300 ease-out">
        <h3 className="font-outfit text-base sm:text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 line-clamp-2">
          {teacher.name}
        </h3>
        <p className="mt-1 text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 line-clamp-1">
          {teacher.designation}
        </p>
      </div>

      {/* Hidden Details Revealed in the Created Space on Hover / Touch:
          Displays Department Badge & Years of Experience.
          Sanad and Specialty are completely removed. */}
      <div
        className={`mt-2.5 flex flex-col items-center gap-2 transition-all duration-300 ease-out ${
          isExpanded
            ? "max-h-24 opacity-100 translate-y-0 pointer-events-auto"
            : "max-h-0 opacity-0 translate-y-2 pointer-events-none overflow-hidden group-hover:max-h-24 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
        }`}
      >
        {/* Department Badge */}
        <Badge color="primary" size="sm" variant="light">
          {teacher.department}
        </Badge>

        {/* Teaching Experience Indicator */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100/90 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300">
          <TimeIcon className="size-3.5 text-brand-500 shrink-0" />
          <span>{teacher.experienceYears}+ Years Experience</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
