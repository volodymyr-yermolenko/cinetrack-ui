import { ActionResult } from "@/types/action-result";
import { useEffect, useState } from "react";

export function useFormErrors<TFieldName extends string = never>(
  actionState: ActionResult<unknown>,
) {
  const [changedFields, setChangedFields] = useState<Set<TFieldName>>(
    new Set<TFieldName>(),
  );

  useEffect(() => {
    if (!actionState.success && actionState.fieldErrors) {
      setChangedFields(new Set<TFieldName>());
    }
  }, [actionState]);

  const markFieldAsChanged = (fieldName: TFieldName) => {
    setChangedFields((prev) => new Set(prev).add(fieldName));
  };

  const getFieldError = (fieldName: TFieldName) => {
    if (changedFields.has(fieldName)) return undefined;
    return !actionState.success
      ? actionState.fieldErrors?.[fieldName]
      : undefined;
  };

  const getFormErrors = () =>
    !actionState.success ? actionState.formErrors : undefined;

  return {
    getFieldError,
    getFormErrors,
    markFieldAsChanged,
  };
}
