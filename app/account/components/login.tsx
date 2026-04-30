"use client";

import { FormField } from "@/components/ui/form-field";
import { LoaderCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { loginUserAction } from "../actions/login-user-action";
import { Login } from "../types/login";
import { LoginStatus } from "../types/login-status";

interface LoginFormProps {
  returnUrl?: string;
}

interface FormState {
  email: string;
  password: string;
}

type FieldName = keyof Login;

export default function LoginForm({ returnUrl }: LoginFormProps) {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
  });
  const { email, password } = formState;

  const [changedFields, setChangedFields] = useState(new Set<FieldName>());

  const [actionState, formAction, isPending] = useActionState(loginUserAction, {
    success: false,
  });

  useEffect(() => {
    if (!actionState.success && actionState.fieldErrors) {
      setChangedFields(new Set<FieldName>());
    }
  }, [actionState]);

  const getFieldError = (fieldName: FieldName) => {
    if (changedFields.has(fieldName)) return undefined;
    return !actionState.success
      ? actionState.fieldErrors?.[fieldName]
      : undefined;
  };

  const emailError = getFieldError("email");
  const passwordError = getFieldError("password");
  const formErrors = !actionState.success ? actionState.formErrors : undefined;

  const handleStringInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    const value = e.target.value;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    setChangedFields((prevState) => new Set(prevState).add(name));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="w-[500px] mx-auto">
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form onSubmit={handleSubmit}>
          {returnUrl && (
            <div>
              <input type="hidden" name={returnUrl} value={returnUrl} />
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
              fieldType="text"
              label="Password"
              name="password"
              value={password}
              required
              onChange={handleStringInputChange}
              error={passwordError}
            />
          </div>
          <hr className="border-gray-300 my-4"></hr>

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

          {actionState.success &&
            actionState.data === LoginStatus.InvalidCredentials && (
              <div className="mt-4">
                <p className="text-red-500 text-sm">Invalid Credentials</p>
              </div>
            )}

          {formErrors && formErrors.length > 0 && (
            <div className="mt-4">
              {formErrors.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
