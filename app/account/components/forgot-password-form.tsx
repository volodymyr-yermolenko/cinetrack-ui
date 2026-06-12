"use client";

import { FormField } from "@/components/ui/form-field";
import { useFormErrors } from "@/lib/hooks/use-form-errors";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { forgotPasswordAction } from "../actions/forgot-password-action";
import FormErrors from "@/components/common/form-errors";
import { LoaderCircle } from "lucide-react";
import { RESEND_CONFIRMATION_INTERVAL_SECONDS } from "../constants";

type FieldName = "email";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSendComplete, setIsSendComplete] = useState(false);
  const [resendInterval, setResendInterval] = useState(
    RESEND_CONFIRMATION_INTERVAL_SECONDS,
  );
  const resendIntervalIdRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [actionState, formAction, isPending] = useActionState(
    forgotPasswordAction,
    {
      success: false,
    },
  );

  const { getFieldError, getFormErrors, markFieldAsChanged } =
    useFormErrors<FieldName>(actionState);

  const clearResendInterval = () => {
    if (resendIntervalIdRef.current) {
      clearInterval(resendIntervalIdRef.current);
      resendIntervalIdRef.current = null;
    }
  };

  useEffect(() => {
    if (actionState.success) {
      setIsSendComplete(true);
      resendIntervalIdRef.current = setInterval(() => {
        setResendInterval((prev) => prev - 1);
      }, 1000);
    }
    return clearResendInterval;
  }, [actionState]);

  useEffect(() => {
    if (resendInterval <= 0) {
      setResendInterval(RESEND_CONFIRMATION_INTERVAL_SECONDS);
      setIsSendComplete(false);
      clearResendInterval();
    }
  }, [resendInterval]);

  const emailError = getFieldError("email");
  const formErrors = getFormErrors();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setEmail(value);
    markFieldAsChanged(name);

    if (isSendComplete) {
      setResendInterval(0);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex items-center h-[700px]">
      <div className="w-[500px] mx-auto">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <p>
                Enter the email address associated with your account. We'll send
                you a secure link to reset your password.
              </p>
              <FormField
                fieldType="text"
                label="Email"
                name="email"
                value={email}
                required
                onChange={handleEmailChange}
                error={emailError}
              />
            </div>
            <hr className="border-gray-300 my-4"></hr>
            <div>
              <button
                className="btn btn-main btn-primary"
                type="submit"
                disabled={isPending || isSendComplete}
              >
                {!isPending ? (
                  "Send Reset Link"
                ) : (
                  <LoaderCircle className="mx-2 animate-spin" />
                )}
              </button>
            </div>

            {isSendComplete && (
              <div className="flex flex-col mt-4 text-sm gap-2">
                <p>
                  We've sent an email with instructions to reset your password
                  if that email address is registered in our system.
                </p>
                <p>
                  Please check your inbox. You can resend another link in{" "}
                  {resendInterval} seconds.
                </p>
              </div>
            )}
            <FormErrors errors={formErrors} className="mt-4" />
          </form>
        </div>
      </div>
    </div>
  );
}
