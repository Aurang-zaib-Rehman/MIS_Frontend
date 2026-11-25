import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { MotionFadeIn } from "@/components/public/Motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthService } from "@/services/authService";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!fullName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!isChecked) {
      setErrorMessage("Please accept the terms and conditions to register.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthService.register({
        fullName,
        email: trimmedEmail,
        password,
        guardianName: guardianName.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        address: address.trim() || undefined,
      });

      setSuccessMessage(
        response.message || "Registration successful! Redirecting you to the sign-in page..."
      );

      // Strictly redirect to Sign In page after registration — NO auto-login, NO dashboard
      setTimeout(() => {
        navigate("/signin", {
          replace: true,
          state: {
            registeredEmail: trimmedEmail,
            message: "Student account created successfully! Please sign in with your email and password.",
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

          <div>
            <form onSubmit={handleSubmit}>
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
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
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
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Bilal"
                      required
                    />
                  </div>
                </div>

                {/* Father / Guardian Name */}
                <div>
                  <Label>
                    Father / Guardian Name
                  </Label>
                  <Input
                    type="text"
                    id="guardian"
                    name="guardian"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter minimum 6 characters"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
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
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0300-1234567"
                    />
                  </div>

                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      id="dob"
                      name="dob"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Faisalabad / Hostel Room No."
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-3 pt-1">
                  <Checkbox
                    className="h-5 w-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block text-xs font-normal text-gray-500 dark:text-gray-400">
                    I agree to the Madrassa{" "}
                    <span className="font-semibold text-gray-800 dark:text-white/90">
                      Academic Regulations & Terms of Service
                    </span>
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating Account..." : "Sign Up as Student"}
                  </Button>
                </div>
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
        </div>
      </MotionFadeIn>
    </div>
  );
}
