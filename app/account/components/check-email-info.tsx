"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { resendConfirmationAction } from "../actions/resend-confirmation-action";
import { LoaderCircle } from "lucide-react";
import FormErrors from "@/components/common/form-errors";
import { RESEND_CONFIRMATION_INTERVAL_SECONDS } from "../constants";

interface CheckEmailInfoProps {
  email?: string;
}

export default function CheckEmailInfo({ email }: CheckEmailInfoProps) {
  const [actionState, formAction, isPending] = useActionState(
    resendConfirmationAction,
    { success: false },
  );

  const [isResendComplete, setIsResendComplete] = useState(false);
  const [resendInterval, setResendInterval] = useState(
    RESEND_CONFIRMATION_INTERVAL_SECONDS,
  );

  useEffect(() => {
    if (actionState.success) {
      setIsResendComplete(true);
      const intervalId = setInterval(() => {
        setResendInterval((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [actionState]);

  useEffect(() => {
    if (resendInterval <= 0) {
      setIsResendComplete(false);
      setResendInterval(RESEND_CONFIRMATION_INTERVAL_SECONDS);
    }
  }, [resendInterval]);

  const handleResendConfirmation = () => {
    const formData = new FormData();
    formData.append("email", email ?? "");
    startTransition(() => {
      formAction(formData);
    });
  };

  const resendErrors = !actionState.success
    ? actionState.formErrors
    : undefined;

  return (
    <div className="flex items-center h-[700px]">
      <div className="w-[500px] mx-auto">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          <p className="text-gray-700">
            We have sent a confirmation email to your email address. Please
            check your mailbox and click on the confirmation link to complete
            your registration.
          </p>
          {email && (
            <div>
              <p className="text-gray-700 mt-4">
                If you haven’t received the email, please check your spam folder
                or click the button below to resend the confirmation email to{" "}
                <strong>{email}</strong>.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="btn btn-main btn-secondary"
                  disabled={isPending || isResendComplete}
                  onClick={handleResendConfirmation}
                >
                  {!isPending ? (
                    "Resend Confirmation Email"
                  ) : (
                    <LoaderCircle className="mx-2 animate-spin" />
                  )}
                </button>
              </div>
              {isResendComplete && (
                <div className="mt-4 text-sm">
                  <p>{`Confirmation email has been resent! Please check your mailbox. You can resend again in ${resendInterval} seconds.`}</p>
                </div>
              )}
              <FormErrors errors={resendErrors} className="mt-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
