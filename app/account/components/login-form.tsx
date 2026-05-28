"use client";

import { FormField } from "@/components/ui/form-field";
import { LoaderCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { loginUserAction } from "../actions/login-user-action";
import { LoginStatus } from "../types/login-status";
import { useFormErrors } from "@/lib/hooks/use-form-errors";
import FormErrors from "@/components/common/form-errors";
import ResendEmailConfirmation from "./resend-email-confirmation";

interface LoginFormProps {
  returnUrl?: string;
}

interface FormState {
  email: string;
  password: string;
}

type FieldName = keyof FormState;

export default function LoginForm({ returnUrl }: LoginFormProps) {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
  });
  const { email, password } = formState;

  const [isResendConfirmationVisible, setIsResendConfirmationVisible] =
    useState(false);

  const [actionState, formAction, isPending] = useActionState(loginUserAction, {
    success: false,
  });

  useEffect(() => {
    if (
      actionState.success &&
      actionState.data === LoginStatus.EmailNotConfirmed
    ) {
      setIsResendConfirmationVisible(true);
    }
  }, [actionState]);

  const { getFieldError, getFormErrors, markFieldAsChanged } =
    useFormErrors<FieldName>(actionState);

  const emailError = getFieldError("email");
  const passwordError = getFieldError("password");
  const formErrors = getFormErrors();

  const handleStringInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    markFieldAsChanged(name);

    if (name === "email" && isResendConfirmationVisible) {
      setIsResendConfirmationVisible(false);
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
          <h1 className="text-2xl font-bold mb-4">Sign In</h1>
          <form onSubmit={handleSubmit}>
            {returnUrl && (
              <div>
                <input type="hidden" name="returnUrl" value={returnUrl} />
              </div>
            )}
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
                fieldType="password"
                label="Password"
                name="password"
                value={password}
                required
                onChange={handleStringInputChange}
                error={passwordError}
              />
            </div>
            <hr className="border-gray-300 my-4"></hr>
            <div>
              {!isResendConfirmationVisible && (
                <button
                  className="btn btn-main btn-primary"
                  type="submit"
                  disabled={isPending}
                >
                  {!isPending ? (
                    "Sign In"
                  ) : (
                    <LoaderCircle className="mx-2 animate-spin" />
                  )}
                </button>
              )}
              {isResendConfirmationVisible && (
                <ResendEmailConfirmation
                  email={email}
                  showTitleMessage={true}
                />
              )}
            </div>

            {/* Messages */}
            {actionState.success &&
              actionState.data === LoginStatus.InvalidCredentials && (
                <div className="mt-4">
                  <p className="text-red-500 text-sm">
                    Invalid email or password
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
