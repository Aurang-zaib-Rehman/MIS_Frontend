import React, { useState, useEffect } from "react";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import type {
  StudentProfileData,
  UpdateStudentProfilePayload,
} from "@/services/studentService";

interface StudentEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfileData | null;
  onSave: (payload: UpdateStudentProfilePayload) => Promise<void>;
}

export const StudentEditProfileModal: React.FC<StudentEditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [fullName, setFullName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setGuardianName(profile.guardianName || "");
      setPhone(profile.phoneNumber || "");
      setDob(profile.dateOfBirth || "");
      setAddress(profile.address || "");
      setError(null);
    }
  }, [profile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      await onSave({
        fullName: fullName.trim(),
        guardianName: guardianName.trim(),
        phoneNumber: phone.trim(),
        dateOfBirth: dob || undefined,
        address: address.trim(),
      });
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[550px]">
      <div className="relative no-scrollbar w-full overflow-y-auto rounded-3xl bg-white p-6 lg:p-8 dark:bg-gray-900">
        <div className="mb-5">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            Edit Student Profile
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Update your personal contact details. Academic fields and email address are locked by the administration.
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert variant="error" title="Update Error" message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>
              Full Name<span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label>Father / Guardian Name</Label>
            <Input
              type="text"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              placeholder="Enter father or guardian name"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Contact / Phone</Label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Residential Address</Label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter residential address"
            />
          </div>

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
              onClick={onClose}
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
  );
};

export default StudentEditProfileModal;
