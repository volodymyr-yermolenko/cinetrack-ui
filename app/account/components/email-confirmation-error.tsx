"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { EmailConfirmationErrorReason } from "../types/email-confirmation-error-reason";
import { resendConfirmationAction } from "../actions/resend-confirmation-action";
import { RESEND_CONFIRMATION_INTERVAL_SECONDS } from "../constants";
import { LoaderCircle } from "lucide-react";
import FormErrors from "@/components/common/form-errors";

interface EmailConfirmationErrorProps {
  reason: EmailConfirmationErrorReason;
  registrationEmail?: string;
}

export function EmailConfirmationError({
  reason,
  registrationEmail,
}: EmailConfirmationErrorProps) {
  const [isResendComplete, setIsResendComplete] = useState(false);
  const [resendInterval, setResendInterval] = useState(
    RESEND_CONFIRMATION_INTERVAL_SECONDS,
  );

  const [actionState, resendAction, isPending] = useActionState(
    resendConfirmationAction,
    { success: false },
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
    formData.append("email", registrationEmail ?? "");
    startTransition(() => {
      resendAction(formData);
    });
  };

  const resendErrors = !actionState.success
    ? actionState.formErrors
    : undefined;

  let content;

  switch (reason) {
    case EmailConfirmationErrorReason.NoToken:
      content = "Invalid confirmation link. No token provided.";
      break;
    case EmailConfirmationErrorReason.InvalidToken:
      content =
        "Invalid confirmation link. You might have already confirmed your registration or the token is incorrect.";
      break;
    case EmailConfirmationErrorReason.TokenExpired:
      content = (
        <div>
          <p className="text-gray-700 mt-4">
            Confirmation token has expired. This can happen if you received the
            confirmation email a while ago and didn’t click the link in time.
            You can request a new confirmation email to be sent to your email
            address <strong>{registrationEmail}</strong>.
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
      );
      break;
    default:
      content = "An unknown error occurred. Please try again.";
  }

  return (
    <div className="flex items-center h-[700px]">
      <div className="w-[500px] mx-auto">
        <div className="p-6 bg-white rounded-lg shadow">{content}</div>
      </div>
    </div>
  );
}
