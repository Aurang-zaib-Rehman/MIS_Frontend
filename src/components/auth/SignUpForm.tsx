import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { MotionFadeIn } from "@/components/public/Motion";
import { AuthService } from "@/services/authService";
import {
  StudentRegistrationFields,
  type StudentRegistrationFormValues,
} from "./StudentRegistrationFields";

const initialFormValues: StudentRegistrationFormValues = {
  firstName: "",
  lastName: "",
  guardianName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  address: "",
  password: "",
  isChecked: true,
};

export default function SignUpForm() {
  const navigate = useNavigate();

  const [formValues, setFormValues] =
    useState<StudentRegistrationFormValues>(initialFormValues);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFieldChange = <K extends keyof StudentRegistrationFormValues>(
    field: K,
    value: StudentRegistrationFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullName = [
      formValues.firstName.trim(),
      formValues.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    if (!fullName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    const trimmedEmail = formValues.email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!formValues.password || formValues.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!formValues.isChecked) {
      setErrorMessage("Please accept the terms and conditions to register.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthService.register({
        fullName,
        email: trimmedEmail,
        password: formValues.password,
        guardianName: formValues.guardianName.trim() || undefined,
        phoneNumber: formValues.phoneNumber.trim() || undefined,
        dateOfBirth: formValues.dateOfBirth || undefined,
        address: formValues.address.trim() || undefined,
      });

      setSuccessMessage(
        response.message ||
          "Registration successful! Redirecting you to the sign-in page..."
      );

      // Strictly redirect to Sign In page after registration — NO auto-login, NO dashboard
      setTimeout(() => {
        navigate("/signin", {
          replace: true,
          state: {
            registeredEmail: trimmedEmail,
            message:
              "Student account created successfully! Please sign in with your email and password.",
          },
        });
      }, 1500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please check your information and try again.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto px-4 pb-12 sm:px-6 sm:pb-16 lg:w-1/2 lg:px-8">
      <div className="mx-auto mb-5 w-full max-w-md sm:pt-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          Back to website
        </Link>
      </div>

      <MotionFadeIn
        direction="left"
        duration={0.4}
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center"
      >
        <div>
          <div className="mb-5 sm:mb-6">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
              Student Registration Portal
            </div>
            <h1 className="mb-1 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Create Student Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Register for institutional access to the Madrassa MIS Student Portal.
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5">
              <Alert
                variant="error"
                title="Registration Failed"
                message={errorMessage}
              />
            </div>
          )}

          {successMessage && (
            <div className="mb-5">
              <Alert
                variant="success"
                title="Registration Successful"
                message={successMessage}
              />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <StudentRegistrationFields
              values={formValues}
              onChange={handleFieldChange}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Submit Button */}
            <div className="pt-5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:opacity-50"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up as Student"}
              </Button>
            </div>
          </form>

          <div className="mt-5 pb-6 sm:pb-8">
            <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
              Already registered?{" "}
              <Link
                to="/signin"
                className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In to Your Account
              </Link>
            </p>
          </div>
        </div>
      </MotionFadeIn>
    </div>
  );
}
