export type ExecuteResult<T = void> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      errors?: string[];
    };
