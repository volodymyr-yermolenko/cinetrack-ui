"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { RESEND_CONFIRMATION_INTERVAL_SECONDS } from "../constants";
import { resendConfirmationAction } from "../actions/resend-confirmation-action";
import { LoaderCircle } from "lucide-react";
import FormErrors from "@/components/common/form-errors";

interface ResendEmailConfirmationProps {
  email: string;
  showTitleMessage: boolean;
}

export default function ResendEmailConfirmation({
  email,
  showTitleMessage,
}: ResendEmailConfirmationProps) {
  const [isResendComplete, setIsResendComplete] = useState(false);
  const [resendInterval, setResendInterval] = useState(
    RESEND_CONFIRMATION_INTERVAL_SECONDS,
  );
  const resendIntervalIdRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [resendActionState, resendAction, isResendPending] = useActionState(
    resendConfirmationAction,
    {
      success: false,
    },
  );

  useEffect(() => {
    if (resendActionState.success) {
      setIsResendComplete(true);
      resendIntervalIdRef.current = setInterval(() => {
        setResendInterval((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (resendIntervalIdRef.current) {
        clearInterval(resendIntervalIdRef.current);
      }
    };
  }, [resendActionState]);

  useEffect(() => {
    if (resendInterval <= 0) {
      setResendInterval(RESEND_CONFIRMATION_INTERVAL_SECONDS);
      setIsResendComplete(false);
      if (resendIntervalIdRef.current) {
        clearInterval(resendIntervalIdRef.current);
      }
    }
  }, [resendInterval]);

  const resendErrors = !resendActionState.success
    ? resendActionState.formErrors
    : undefined;

  const handleResendConfirmationClick = () => {
    const formData = new FormData();
    formData.append("email", email);
    startTransition(() => {
      resendAction(formData);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {showTitleMessage && (
        <p>
          We've found an account for <strong>{email}</strong> that hasn’t been
          confirmed yet. Please check your inbox or resend the confirmation
          email.
        </p>
      )}
      <div>
        <button
          type="button"
          className="btn btn-main btn-secondary"
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
      {isResendComplete && (
        <div className="text-sm">
          <p>Confirmation email has been resent!</p>
          <p>
            Please check your inbox. You can resend it after {resendInterval}{" "}
            seconds.
          </p>
        </div>
      )}
      <FormErrors errors={resendErrors} className="mt-2" />
    </div>
  );
}
