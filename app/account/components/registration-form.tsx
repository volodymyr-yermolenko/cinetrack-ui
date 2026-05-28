"use client";

import { FormField } from "@/components/ui/form-field";
import { useFormErrors } from "@/lib/hooks/use-form-errors";
import { LoaderCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { registerUserAction } from "../actions/register-user-action";
import { RegistrationStatus } from "../types/registration-status";
import FormErrors from "@/components/common/form-errors";
import ResendEmailConfirmation from "./resend-email-confirmation";

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

  const [isResendConfirmationVisible, setIsResendConfirmationVisible] =
    useState(false);

  const [actionState, formAction, isPending] = useActionState(
    registerUserAction,
    {
      success: false,
    },
  );

  useEffect(() => {
    if (
      actionState.success &&
      actionState.data === RegistrationStatus.UserNotConfirmed
    ) {
      setIsResendConfirmationVisible(true);
    }
  }, [actionState]);

  const { getFieldError, getFormErrors, markFieldAsChanged } =
    useFormErrors<FieldName>(actionState);

  const emailError = getFieldError("email");
  const nameError = getFieldError("name");
  const passwordError = getFieldError("password");
  const confirmPasswordError = getFieldError("confirmPassword");
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

            <div>
              {!isResendConfirmationVisible && (
                <button
                  className="btn btn-main btn-primary"
                  type="submit"
                  disabled={isPending}
                >
                  {!isPending ? (
                    "Sign Up"
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
              actionState.data === RegistrationStatus.UserExists && (
                <div className="mt-4">
                  <p className="text-red-500 text-sm">
                    User with this Email already exists.
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
