"use client";

import { FormField } from "@/components/ui/form-field";
import { useFormErrors } from "@/lib/hooks/use-form-errors";
import { LoaderCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { registerUserAction } from "../actions/register-user-action";
import { RegistrationStatus } from "../types/registration-status";
import { resendConfirmationAction } from "../actions/resend-confirmation-action";
import FormErrors from "@/components/common/form-errors";
import { RESEND_CONFIRMATION_INTERVAL_SECONDS } from "../constants";

interface FormState {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

type FieldName = keyof FormState;

export default function RegistrationForm() {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const { email, name, password } = formState;

  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [isResendComplete, setIsResendComplete] = useState(false);
  const [resendInterval, setResendInterval] = useState(
    RESEND_CONFIRMATION_INTERVAL_SECONDS,
  );

  const [actionState, formAction, isPending] = useActionState(
    registerUserAction,
    {
      success: false,
    },
  );
  const [resendActionState, resendAction, isResendPending] = useActionState(
    resendConfirmationAction,
    {
      success: false,
    },
  );

  useEffect(() => {
    const showResend =
      actionState.success &&
      actionState.data === RegistrationStatus.UserNotConfirmed;
    setShowResendConfirmation(showResend);
    setIsResendComplete(false);
  }, [actionState]);

  useEffect(() => {
    if (resendActionState.success) {
      setIsResendComplete(true);
      const intervalId = setInterval(() => {
        setResendInterval((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [resendActionState]);

  useEffect(() => {
    if (resendInterval <= 0) {
      setIsResendComplete(false);
      setResendInterval(RESEND_CONFIRMATION_INTERVAL_SECONDS);
    }
  }, [resendInterval]);

  const { getFieldError, getFormErrors, markFieldAsChanged } =
    useFormErrors<FieldName>(actionState);

  const emailError = getFieldError("email");
  const nameError = getFieldError("name");
  const passwordError = getFieldError("password");
  const confirmPasswordError = getFieldError("confirmPassword");
  const formErrors = getFormErrors();

  const resendErrors = !resendActionState.success
    ? resendActionState.formErrors
    : undefined;

  const handleStringInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    markFieldAsChanged(name);

    if (name === "email" && showResendConfirmation) {
      setShowResendConfirmation(false);
      setIsResendComplete(false);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleResendConfirmationClick = () => {
    const formData = new FormData();
    formData.append("email", email);
    startTransition(() => {
      resendAction(formData);
    });
  };

  const resendConfirmationContent = !isResendComplete ? (
    <>
      We found an account for <strong>{email}</strong> that hasn’t been
      confirmed yet. Please check your mailbox or resend the confirmation email.
    </>
  ) : (
    <>
      Confirmation email has been resent! Please check your mailbox. You can
      resend again after {resendInterval} seconds.
    </>
  );

  return (
    <div className="flex items-center h-[700px]">
      <div className="w-[500px] mx-auto">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <FormField
                fieldType="text"
                label="Email"
                name="email"
                value={email}
                required
                onChange={handleStringInputChange}
                error={emailError}
              />
              <FormField
                fieldType="text"
                label="User Name"
                name="name"
                value={name}
                required
                onChange={handleStringInputChange}
                error={nameError}
              />
              <FormField
                fieldType="password"
                label="Password"
                name="password"
                value={password}
                required
                onChange={handleStringInputChange}
                error={passwordError}
              />
              <FormField
                fieldType="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formState.confirmPassword}
                required
                onChange={handleStringInputChange}
                error={confirmPasswordError}
              />
            </div>
            <hr className="border-gray-300 my-4"></hr>

            <div className="flex justify-between">
              {/* Submit Button */}
              <button
                className="btn btn-main btn-primary"
                type="submit"
                hidden={showResendConfirmation}
                disabled={isPending}
              >
                {!isPending ? (
                  "Sign Up"
                ) : (
                  <LoaderCircle className="mx-2 animate-spin" />
                )}
              </button>

              {/* Resend Confirmation Button */}
              <button
                type="button"
                className="btn btn-main btn-secondary"
                hidden={!showResendConfirmation}
                disabled={isResendPending || isResendComplete}
                onClick={handleResendConfirmationClick}
              >
                {!isResendPending ? (
                  "Resend Confirmation Email"
                ) : (
                  <LoaderCircle className="mx-2 animate-spin" />
                )}
              </button>
            </div>

            {/* Messages */}
            {actionState.success &&
              actionState.data === RegistrationStatus.UserExists && (
                <div className="mt-4">
                  <p className="text-red-500 text-sm">
                    User with this Email already exists.
                  </p>
                </div>
              )}
            {showResendConfirmation && (
              <div className="mt-4">
                <p className="text-sm">{resendConfirmationContent}</p>
              </div>
            )}
            <FormErrors errors={formErrors} className="mt-4" />
            <FormErrors errors={resendErrors} className="mt-4" />
          </form>
        </div>
      </div>
    </div>
  );
}
