export interface ActionResult {
  success: boolean;
  fieldErrors?: Record<string, string>;
  formErrors?: string[];
}
