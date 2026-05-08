export type ActionResult<T = void> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      fieldErrors?: Record<string, string>;
      formErrors?: string[];
    };
