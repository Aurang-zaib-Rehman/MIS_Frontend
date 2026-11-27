import PageMeta from "@/components/common/PageMeta";
import PublicPageBanner from "@/components/public/PublicPageBanner";
import AdmissionTimeline from "@/components/public/AdmissionTimeline";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/public/Motion";
import { CheckCircleIcon, CalenderIcon, CallIcon, ArrowRightIcon } from "@/icons";
import React from "react";
import { Link } from "react-router";

export const Admission: React.FC = () => {
  const eligibilityCriteria = [
    {
      darja: "Department of Quranic Studies (Hifz & Nazra)",
      requirements: [
        "Age between 7 to 14 years for full-time Hifz program.",
        "Basic ability to read Arabic letters or Noorani Qaida (for Nazra).",
        "Student B-Form copy and Father/Guardian CNIC copy.",
        "Commitment to daily evening shift (Asr to Isha).",
      ],
    },
    {
      darja: "Dars-e-Nizami: Darja Oola (Year 1)",
      requirements: [
        "Mandatory Middle (Grade 8) Pass School Certificate from recognized educational board.",
        "Clear phonetics and basic Arabic comprehension.",
        "Original Character Certificate from previous institution.",
        "4 recent passport-size photographs with blue background.",
      ],
    },
    {
      darja: "Dars-e-Nizami: Higher Darjat (Saniya to Samina)",
      requirements: [
        "Official Passing DMC / Sanad of previous Darja from Wafaq-ul-Madaris Al-Arabia.",
        "Minimum 240/600 aggregate marks in the preceding board examination.",
        "Formal Clearance / Leaving Certificate (Dakhila Kharij) from previous seminary.",
        "In-person interview with the Departmental Head.",
      ],
    },
  ];

  return (
    <>
      <PageMeta
        title="Admissions Procedure &amp; Guidelines | Madrasa Uloom-e-Islamia"
        description="Step-by-step in-person admission procedure, required documentation, eligibility criteria, and academic guidelines for Madrasa Uloom-e-Islamia."
      />

      <PublicPageBanner
        title="Admissions Procedure &amp; Guidelines"
        description="Comprehensive in-person admissions pathway, required documentation, and verification process for Academic Session 1447–1448 AH."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Admissions" },
        ]}
        backgroundImage="/images/admission_banner.jpeg"
      />

      <section className="bg-gray-50 py-16 transition-colors sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Key Dates Banner */}
          <MotionFadeIn direction="up" className="mb-14 rounded-2xl border border-brand-200 bg-brand-50/80 p-5 dark:border-brand-900/50 dark:bg-brand-950/40 sm:p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-theme-xs">
                  <CalenderIcon className="size-6" />
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-gray-900 dark:text-white">
                    Annual Academic Session Dates
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    In-Person Admissions Open: <strong>15 Shawwal-ul-Mukarram</strong> · Academic Year Ends: <strong>End of Rajab</strong>
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-success-500 px-3.5 py-1 text-xs font-semibold text-white shadow-theme-xs">
                Admissions Desk Active
              </span>
            </div>
          </MotionFadeIn>

          {/* Eligibility Requirements Section */}
          <div className="mb-20">
            <MotionFadeIn direction="down" className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Departmental Guidelines
              </span>
              <h2 className="mt-1 font-outfit text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Eligibility Criteria &amp; Documentation
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Please review the specific document checklist and academic criteria for your intended program before visiting the campus.
              </p>
            </MotionFadeIn>

            <MotionStaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {eligibilityCriteria.map((item, idx) => (
                <MotionStaggerItem key={idx} direction="up">
                  <div className="h-full rounded-2xl border border-gray-200/90 bg-white p-6 shadow-theme-xs transition-all hover:border-brand-300 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-700/60">
                    <h4 className="font-outfit text-base font-bold text-gray-900 dark:text-white">
                      {item.darja}
                    </h4>
                    <ul className="mt-4 space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                      {item.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <CheckCircleIcon className="size-4 shrink-0 mt-0.5 text-brand-500" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </MotionStaggerItem>
              ))}
            </MotionStaggerContainer>
          </div>

          {/* Animated Vertical Admission Timeline */}
          <div className="mb-20">
            <AdmissionTimeline />
          </div>

          {/* Call to Action Section */}
          <MotionFadeIn direction="up" className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 text-white shadow-theme-lg sm:p-12 dark:border-brand-800">
              <div className="relative z-10 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  Admissions Office Open
                </span>
                <h3 className="mt-4 font-outfit text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                  Ready to Begin Your Journey?
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                  Visit our madrassa with the required documents. Our administration team will guide you through every step of the admission process.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-theme-xs transition-all hover:bg-brand-50 hover:shadow-theme-md"
                  >
                    <CallIcon className="size-4 shrink-0 text-brand-700" />
                    <span>Contact Administration</span>
                  </Link>
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white"
                  >
                    <span>View Available Courses</span>
                    <ArrowRightIcon className="size-4 shrink-0 text-white" />
                  </Link>
                </div>

                {/* Campus Information & Hours */}
                <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
                  <span>📍 Campus Location: Main Administrative Block, Admissions Desk</span>
                  <span>⏰ Desk Hours: Daily 08:00 AM – 02:00 PM (Except Friday Afternoon)</span>
                </div>
              </div>
            </div>
          </MotionFadeIn>
        </div>
      </section>
    </>
  );
};

export default Admission;
