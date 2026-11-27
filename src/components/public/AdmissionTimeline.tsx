import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  MultiUserIcon,
  DocsIcon,
  FolderIcon,
  FileIcon,
  TaskIcon,
  SparkIcon,
  CheckLineIcon,
} from "@/icons";

export interface AdmissionStepItem {
  number: string;
  title: string;
  subtitle: string;
  points: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const admissionSteps: AdmissionStepItem[] = [
  {
    number: "01",
    title: "Visit the Madrassa Physically",
    subtitle: "In-Person Guidance & Campus Orientation",
    points: [
      "Physical admissions open starting from 15 Shawwal-ul-Mukarram.",
      "Visit the Admissions Information Desk at the Main Administrative Block.",
      "Receive personalized counseling on academic streams (Hifz vs. Dars-e-Nizami).",
      "Inspect campus facilities including residential hostels, classrooms, and library.",
    ],
    icon: MultiUserIcon,
  },
  {
    number: "02",
    title: "Collect Program & Eligibility Information",
    subtitle: "Departmental Criteria & Prerequisite Review",
    points: [
      "Hifz & Nazra: Age 7–14 years with foundational Noorani Qaida proficiency.",
      "Dars-e-Nizami (Darja Oola): Mandatory Grade 8 school-passing certificate.",
      "Higher Darjat (Saniya to Samina): Previous Wafaq-ul-Madaris passing DMC.",
      "Review boarding regulations, hostel amenities, and daily class shift timings.",
    ],
    icon: DocsIcon,
  },
  {
    number: "03",
    title: "Prepare Required Documents",
    subtitle: "Document Dossier & Identity Verification",
    points: [
      "Original and verified photocopies of Student B-Form or CNIC.",
      "Copy of Father / Guardian Computerized National Identity Card (CNIC).",
      "4 recent passport-size photographs with light blue background.",
      "Character certificate / formal leaving certificate (Dakhila Kharij) from previous institution.",
    ],
    icon: FolderIcon,
  },
  {
    number: "04",
    title: "Submit Documents in Person",
    subtitle: "Administrative Desk Submission & Token",
    points: [
      "Present original educational credentials and identity documents for preliminary sighting.",
      "Receive an official physical verification token and scheduled evaluation time slot.",
      "Register emergency guardian contact numbers and hometown permanent address.",
      "Select residential (boarder) or local day-scholar attendance status.",
    ],
    icon: FileIcon,
  },
  {
    number: "05",
    title: "Admission Verification & Evaluation",
    subtitle: "Academic Assessment & Faculty Review",
    points: [
      "Hifz & Nazra: Oral recitation test assessing Tajweed, Makharij, and memorization aptitude.",
      "Dars-e-Nizami: Basic Arabic grammar comprehension and Urdu reading evaluation.",
      "Departmental Head interview with both the student and the guardian.",
      "Any missing certificates or document discrepancies are identified and resolved.",
    ],
    icon: TaskIcon,
  },
  {
    number: "06",
    title: "Admission Confirmation & MIS Registration",
    subtitle: "Official Sanction & Portal Profile Creation",
    points: [
      "Issuance of official Madrassa Admission Number and Student Roll Number.",
      "The Admin provisions the student account and academic assignment in the MIS database.",
      "Collection of fee voucher and academic calendar for Session 1447–1448 AH.",
      "Hostel room allotment and mess card issued for residential students.",
    ],
    icon: SparkIcon,
  },
];

export const AdmissionTimeline: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const cardVariants: Variants = {
    hidden: (isEven: boolean) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : isEven ? 36 : -36,
      y: shouldReduceMotion ? 0 : 20,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  const lineVariants: Variants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const badgeVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 22,
        delay: 0.1,
      },
    },
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mx-auto max-w-2xl text-center mb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
          In-Person Admission Procedure
        </span>
        <h2 className="mt-3 font-outfit text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
          Your Journey to Admission
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Admissions at Madrasa Uloom-e-Islamia are conducted strictly in person to ensure authentic academic evaluation, personal guidance, and proper document verification. Follow these six progressive steps to complete enrollment.
        </p>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative">
        {/* Central Vertical Connecting Line (Desktop) / Left Line (Mobile) */}
        <div className="absolute top-4 bottom-8 left-6 w-0.5 md:left-1/2 md:-translate-x-1/2">
          <div className="h-full w-full bg-gray-200 dark:bg-gray-800" />
          <motion.div
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="absolute top-0 bottom-0 left-0 w-full origin-top bg-gradient-to-b from-brand-500 via-brand-600 to-brand-400"
          />
        </div>

        {/* Steps List */}
        <div className="space-y-10 sm:space-y-12">
          {admissionSteps.map((step, idx) => {
            const isEven = idx % 2 === 1; // 0-based: 0 (Left), 1 (Right), 2 (Left), etc.
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative flex flex-col md:flex-row md:items-center"
              >
                {/* Timeline Step Indicator Circle */}
                <motion.div
                  variants={badgeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="absolute left-6 z-10 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-brand-500 text-white shadow-theme-sm transition-transform duration-300 hover:scale-110 md:left-1/2 md:-translate-x-1/2 dark:border-gray-950 dark:bg-brand-500"
                >
                  <Icon className="size-5 shrink-0" />
                </motion.div>

                {/* Left or Right Column (Desktop) */}
                <div
                  className={`w-full pl-14 sm:pl-16 md:w-1/2 md:pl-0 ${
                    isEven ? "md:order-2 md:pl-12" : "md:order-1 md:pr-12"
                  }`}
                >
                  <motion.div
                    custom={isEven}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    whileHover={shouldReduceMotion ? {} : { y: -4 }}
                    className="group relative text-left rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-theme-xs transition-all duration-300 hover:border-brand-300 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-700/60"
                  >
                    {/* Top Step Meta - Consistently Left-Aligned */}
                    <div className="flex items-center gap-2 mb-2 justify-start">
                      <span className="font-outfit text-2xl font-black text-brand-500/25 dark:text-brand-400/25">
                        {step.number}
                      </span>
                      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-theme-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                        Step {step.number}
                      </span>
                    </div>

                    {/* Step Title & Subtitle - Consistently Left-Aligned */}
                    <h3 className="font-outfit text-lg font-bold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 sm:text-xl transition-colors text-left">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400 text-left">
                      {step.subtitle}
                    </p>

                    {/* Bullet Points - Consistently Left-Aligned on both Left and Right Columns */}
                    <ul className="mt-3.5 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300 text-left">
                      {step.points.map((pt, pIdx) => (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2 justify-start text-left"
                        >
                          <CheckLineIcon className="size-4 shrink-0 mt-0.5 text-brand-500" />
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Empty Balancing Spacer for Desktop Alternating Grid */}
                <div
                  className={`hidden md:block md:w-1/2 ${
                    isEven ? "md:order-1" : "md:order-2"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdmissionTimeline;
