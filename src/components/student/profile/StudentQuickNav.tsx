import React from "react";
import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DollarLineIcon,
  GridIcon,
  TaskIcon,
} from "@/icons";

export interface StudentQuickNavItem {
  title: string;
  subtitle: string;
  path: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  hoverColor: string;
}

const defaultNavItems: StudentQuickNavItem[] = [
  {
    title: "Student Dashboard",
    subtitle: "Overview & Analytics",
    path: "/student/dashboard",
    icon: <GridIcon className="size-5" />,
    iconBg: "bg-brand-50 dark:bg-brand-950/60",
    iconColor: "text-brand-600 dark:text-brand-400",
    hoverColor: "group-hover:text-brand-600",
  },
  {
    title: "Examination Results",
    subtitle: "Mark sheets & Wifaq",
    path: "/student/results",
    icon: <TaskIcon className="size-5" />,
    iconBg: "bg-blue-50 dark:bg-blue-950/60",
    iconColor: "text-blue-600 dark:text-blue-400",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    title: "Fee Vouchers",
    subtitle: "Dues & Challans",
    path: "/student/fees",
    icon: <DollarLineIcon className="size-5" />,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    hoverColor: "group-hover:text-emerald-600",
  },
  {
    title: "Attendance Records",
    subtitle: "Daily Presence Log",
    path: "/student/attendance",
    icon: <CheckCircleIcon className="size-5" />,
    iconBg: "bg-purple-50 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    hoverColor: "group-hover:text-purple-600",
  },
];

export const StudentQuickNav: React.FC = () => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {defaultNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-white/3"
        >
          <div className="flex items-center justify-between">
            <span
              className={`flex size-9 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
            >
              {item.icon}
            </span>
            <ArrowRightIcon
              className={`size-4 text-gray-400 transition group-hover:translate-x-1 ${item.hoverColor}`}
            />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {item.title}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {item.subtitle}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StudentQuickNav;
