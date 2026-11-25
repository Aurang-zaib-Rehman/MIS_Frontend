import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Alert from "@/components/ui/alert/Alert";
import { useModal } from "@/hooks/useModal";
import StudentService, {
  type StudentProfileData,
  type UpdateStudentProfilePayload,
} from "@/services/studentService";
import {
  StudentQuickNav,
  StudentProfileHeader,
  StudentDigitalIdBadge,
  StudentEnrollmentNotice,
  StudentPersonalDetailsCard,
  StudentAcademicDetailsCard,
  StudentEditProfileModal,
} from "@/components/student/profile";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await StudentService.getProfile();
      setProfile(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to load student profile from database.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (payload: UpdateStudentProfilePayload) => {
    const updated = await StudentService.updateProfile(payload);
    setProfile(updated);
    setSaveSuccess("Profile information updated successfully in database.");
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading student profile from database...
          </p>
        </div>
      </div>
    );
  }

  const isEnrolled = Boolean(profile?.academic?.isAssigned);

  return (
    <>
      <PageMeta
        title="Student Profile | Madrassa MIS"
        description="Official student identity and academic record for Madrassa MIS"
      />
      <PageBreadcrumb pageTitle="Student Profile & Academic Record" />

      {/* Global Alerts */}
      {error && (
        <div className="mb-6">
          <Alert variant="error" title="Profile Error" message={error} />
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6">
          <Alert variant="success" title="Success" message={saveSuccess} />
        </div>
      )}

      {/* Quick Navigation Cards */}
      <StudentQuickNav />

      {/* Main Profile Header */}
      <StudentProfileHeader
        profile={profile}
        onEditClick={openModal}
        onPrintClick={handlePrintCard}
      />

      {/* Main Grid: Digital ID Badge (Left) & Personal/Academic Details (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <StudentDigitalIdBadge profile={profile} />
        </div>

        <div className="space-y-6 lg:col-span-7">
          {!isEnrolled && <StudentEnrollmentNotice />}

          <StudentPersonalDetailsCard
            profile={profile}
            onEditClick={openModal}
          />

          <StudentAcademicDetailsCard academic={profile?.academic} />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <StudentEditProfileModal
        isOpen={isOpen}
        onClose={closeModal}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </>
  );
}
