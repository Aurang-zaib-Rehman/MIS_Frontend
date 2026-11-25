import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Alert from "@/components/ui/alert/Alert";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DollarLineIcon,
  DownloadIcon,
  GridIcon,
  PencilIcon,
  TaskIcon,
} from "@/icons";
import StudentService, {
  type StudentProfileData,
} from "@/services/studentService";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Edit Modal State
  const { isOpen, openModal, closeModal } = useModal();
  const [editFullName, setEditFullName] = useState("");
  const [editGuardianName, setEditGuardianName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await StudentService.getProfile();
      setProfile(data);
      // Preload modal inputs
      setEditFullName(data.fullName || "");
      setEditGuardianName(data.guardianName || "");
      setEditPhone(data.phoneNumber || "");
      setEditDob(data.dateOfBirth || "");
      setEditAddress(data.address || "");
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

  const handleOpenEdit = () => {
    if (profile) {
      setEditFullName(profile.fullName || "");
      setEditGuardianName(profile.guardianName || "");
      setEditPhone(profile.phoneNumber || "");
      setEditDob(profile.dateOfBirth || "");
      setEditAddress(profile.address || "");
      setEditError(null);
    }
    openModal();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setIsSaving(true);
    try {
      const updated = await StudentService.updateProfile({
        fullName: editFullName.trim(),
        guardianName: editGuardianName.trim(),
        phoneNumber: editPhone.trim(),
        dateOfBirth: editDob || undefined,
        address: editAddress.trim(),
      });
      setProfile(updated);
      setSaveSuccess("Profile information updated successfully in database.");
      closeModal();
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile.";
      setEditError(msg);
    } finally {
      setIsSaving(false);
    }
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

  const academic = profile?.academic;
  const isEnrolled = Boolean(academic?.isAssigned);

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

      {/* Quick Navigation Cards to other student sections */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          to="/student/dashboard"
          className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-white/3"
        >
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <GridIcon className="size-5" />
            </span>
            <ArrowRightIcon className="size-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-brand-600" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              Student Dashboard
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Overview & Analytics
            </p>
          </div>
        </Link>

        <Link
          to="/student/results"
          className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-white/3"
        >
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <TaskIcon className="size-5" />
            </span>
            <ArrowRightIcon className="size-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              Examination Results
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Mark sheets & Wifaq
            </p>
          </div>
        </Link>

        <Link
          to="/student/fees"
          className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-white/3"
        >
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <DollarLineIcon className="size-5" />
            </span>
            <ArrowRightIcon className="size-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              Fee Vouchers
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Dues & Challans
            </p>
          </div>
        </Link>

        <Link
          to="/student/attendance"
          className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-white/3"
        >
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <CheckCircleIcon className="size-5" />
            </span>
            <ArrowRightIcon className="size-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              Attendance Records
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Daily Presence Log
            </p>
          </div>
        </Link>
      </div>

      {/* Main Profile Header Card */}
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
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
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
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5"
            >
              <PencilIcon className="size-4" />
              <span>Edit Profile</span>
            </Button>
            <Button
              size="sm"
              onClick={handlePrintCard}
              className="inline-flex items-center gap-1.5"
            >
              <DownloadIcon className="size-4" />
              <span>Print Student ID Card</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Official Digital Student ID Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 shadow-xs dark:border-gray-800 dark:bg-white/3">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Official Student ID Badge
              </h3>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                VERIFIED ID
              </span>
            </div>

            {/* Smart ID Card Simulation with REAL Database Data */}
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-2 border-brand-500/40 bg-linear-to-br from-white via-brand-50/20 to-emerald-50/30 p-5 shadow-md dark:border-brand-500/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
              {/* Header */}
              <div className="border-b border-gray-200 pb-3 text-center dark:border-gray-700">
                <p className="text-[10px] font-bold text-brand-700 dark:text-brand-300">
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
                </p>
                <h4 className="mt-0.5 text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
                  JAMIA MADRASSA ULOOM-E-ISLAMIA
                </h4>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">
                  Affiliated with Wifaq-ul-Madaris Al-Arabia Pakistan
                </p>
                <div className="mt-1.5 inline-block rounded-md bg-brand-600 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  STUDENT IDENTITY CARD &bull; بطاقة الطالب
                </div>
              </div>

              {/* Body */}
              <div className="mt-4 flex items-start gap-4">
                <div className="shrink-0 text-center">
                  <div className="size-20 overflow-hidden rounded-xl border-2 border-brand-500/40 shadow-xs">
                    <img
                      src="/images/user/owner.png"
                      alt={profile?.fullName || "Student"}
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="mt-1.5 inline-block rounded-sm bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {profile?.role || "STUDENT"}
                  </span>
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <h5 className="font-bold text-gray-900 dark:text-white">
                    {profile?.fullName || "Not provided"}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    S/O:{" "}
                    <strong className="text-gray-800 dark:text-gray-200">
                      {profile?.guardianName || (
                        <span className="italic text-gray-400">Not assigned yet</span>
                      )}
                    </strong>
                  </p>
                  <div className="space-y-1 pt-1 text-[11px]">
                    <div className="flex justify-between border-b border-gray-100 pb-0.5 dark:border-gray-800">
                      <span className="text-gray-500">Roll No:</span>
                      <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                        {academic?.rollNo || (
                          <span className="italic font-normal text-gray-400">Not assigned yet</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-0.5 dark:border-gray-800">
                      <span className="text-gray-500">Darja / Class:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {academic?.darja || (
                          <span className="italic font-normal text-gray-400">Not assigned yet</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-0.5 dark:border-gray-800">
                      <span className="text-gray-500">Department:</span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {academic?.department || (
                          <span className="italic text-gray-400">Not assigned yet</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Admission No:</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">
                        {academic?.studentId ? `ADM-${academic.studentId}` : (
                          <span className="italic text-gray-400">Not assigned yet</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-[10px] dark:border-gray-700">
                <div>
                  <p className="font-mono font-bold tracking-widest text-gray-700 dark:text-gray-300">
                    |||| || ||| ||||| |||
                  </p>
                  <span className="text-[9px] text-gray-400">
                    UID: {profile?.userId ? String(profile.userId).padStart(6, "0") : "000000"}
                  </span>
                </div>
                <div className="text-end">
                  <span className="block text-[9px] text-gray-400">Status:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {isEnrolled ? "Active Enrolled" : "Registered"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Information & Institutional Details */}
        <div className="space-y-6 lg:col-span-7">
          {/* Institutional Academic Assignment Status Notice */}
          {!isEnrolled && (
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
          )}

          {/* Personal Information Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 shadow-xs dark:border-gray-800 dark:bg-white/3">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Personal Profile Details
              </h3>
              <button
                type="button"
                onClick={handleOpenEdit}
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

          {/* Academic Records Card (Admin-Controlled Fields: Read-Only for Students) */}
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
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[550px]">
        <div className="relative no-scrollbar w-full overflow-y-auto rounded-3xl bg-white p-6 lg:p-8 dark:bg-gray-900">
          <div className="mb-5">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Edit Student Profile
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update your personal contact details. Academic fields and email address are locked by the administration.
            </p>
          </div>

          {editError && (
            <div className="mb-4">
              <Alert variant="error" title="Update Error" message={editError} />
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <Label>Full Name<span className="text-error-500">*</span></Label>
              <Input
                type="text"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label>Father / Guardian Name</Label>
              <Input
                type="text"
                value={editGuardianName}
                onChange={(e) => setEditGuardianName(e.target.value)}
                placeholder="Enter father or guardian name"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Contact / Phone</Label>
                <Input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="0300-1234567"
                />
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Residential Address</Label>
              <Input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Enter residential address"
              />
            </div>

            {/* Read-Only Notice */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <p>
                <strong>Note:</strong> Email ({profile?.email}) and academic assignments (Department, Darja, Roll Number, Monthly Fee) cannot be altered here. Contact administration for institutional record adjustments.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeModal}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSaving}>
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
