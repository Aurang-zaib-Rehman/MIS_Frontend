import PageMeta from "@/components/common/PageMeta";
import PublicPageBanner from "@/components/public/PublicPageBanner";
import BankDetailsCard from "@/components/public/BankDetailsCard";
import { MotionFadeIn } from "@/components/public/Motion";
import React from "react";

export const Fundraising: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Fundraising &amp; Donations | Madrasa Uloom-e-Islamia"
        description="Sponsor a Talib-e-Ilm, donate Zakat, or contribute to Sadaqah Jariyah projects at Madrasa Uloom-e-Islamia with 100% financial transparency."
      />

      <PublicPageBanner
        title="Fundraising &amp; Islamic Donations"
        description="Invest in your eternal Akhirah. Support deserving students of Quran and Hadith through verified Zakat and Sadaqah Jariyah."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Fundraising & Donations" },
        ]}
        backgroundImage="/images/donation_banner.jpeg"
      />

      <section className="bg-gray-50 py-16 transition-colors sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Spiritual Quote Banner */}
          <MotionFadeIn direction="down" className="mb-14 rounded-3xl border border-success-200 bg-gradient-to-r from-success-50/70 via-white to-brand-50/40 p-8 text-center dark:border-gray-800 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            <span className="rounded-full bg-success-500/15 px-3 py-1 text-xs font-semibold text-success-700 dark:text-success-400">
              The Virtue of Sadaqah Jariyah
            </span>
            <blockquote className="mt-4 font-outfit text-lg font-medium text-gray-800 sm:text-xl dark:text-gray-200">
              &ldquo;When a human being dies, their deeds come to an end, except for three:
              a continuous charity (Sadaqah Jariyah), knowledge from which benefit is derived,
              or a righteous child who prays for them.&rdquo;
            </blockquote>
            <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              — Sahih Muslim 1631
            </p>
          </MotionFadeIn>

          {/* Transparent Bank Details Section */}
          <MotionFadeIn direction="left" className="w-full">
            <div>
              <BankDetailsCard />
            </div>
          </MotionFadeIn>
        </div>
      </section>
    </>
  );
};

export default Fundraising;
