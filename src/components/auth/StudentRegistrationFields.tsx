import React from "react";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "@/icons";

export interface StudentRegistrationFormValues {
  firstName: string;
  lastName: string;
  guardianName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  password: string;
  isChecked: boolean;
}

interface StudentRegistrationFieldsProps {
  values: StudentRegistrationFormValues;
  onChange: <K extends keyof StudentRegistrationFormValues>(
    field: K,
    value: StudentRegistrationFormValues[K]
  ) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export const StudentRegistrationFields: React.FC<StudentRegistrationFieldsProps> = ({
  values,
  onChange,
  showPassword,
  onTogglePassword,
}) => {
  return (
    <div className="space-y-4">
      {/* First and Last Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>
            First Name<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="fname"
            name="fname"
            value={values.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="e.g. Muhammad"
            required
          />
        </div>

        <div>
          <Label>
            Last Name<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="lname"
            name="lname"
            value={values.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="e.g. Bilal"
            required
          />
        </div>
      </div>

      {/* Father / Guardian Name */}
      <div>
        <Label>Father / Guardian Name</Label>
        <Input
          type="text"
          id="guardian"
          name="guardian"
          value={values.guardianName}
          onChange={(e) => onChange("guardianName", e.target.value)}
          placeholder="e.g. Hafiz Muhammad Akbar"
        />
      </div>

      {/* Email Address */}
      <div>
        <Label>
          Email Address<span className="text-error-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="student@example.com"
          required
        />
      </div>

      {/* Password with Eye Toggle */}
      <div>
        <Label>
          Password<span className="text-error-500">*</span>
        </Label>
        <div className="relative">
          <Input
            placeholder="Enter minimum 6 characters"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={(e) => onChange("password", e.target.value)}
            required
          />
          <span
            onClick={onTogglePassword}
            className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
            ) : (
              <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
            )}
          </span>
        </div>
      </div>

      {/* Phone Number & Date of Birth */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Contact / Phone</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={values.phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            placeholder="0300-1234567"
          />
        </div>

        <div>
          <Label>Date of Birth</Label>
          <Input
            type="date"
            id="dob"
            name="dob"
            value={values.dateOfBirth}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
          />
        </div>
      </div>

      {/* Residential Address */}
      <div>
        <Label>Current Residential Address</Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="e.g. Faisalabad / Hostel Room No."
        />
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="flex items-center gap-3 pt-1">
        <Checkbox
          className="h-5 w-5"
          checked={values.isChecked}
          onChange={(checked) => onChange("isChecked", checked)}
        />
        <p className="inline-block text-xs font-normal text-gray-500 dark:text-gray-400">
          I agree to the Madrassa{" "}
          <span className="font-semibold text-gray-800 dark:text-white/90">
            Academic Regulations & Terms of Service
          </span>
        </p>
      </div>
    </div>
  );
};

export default StudentRegistrationFields;
