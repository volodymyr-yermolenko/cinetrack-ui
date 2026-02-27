export function formatZodFieldErrors(
  zodFieldErrors: Record<string, string[] | undefined>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in zodFieldErrors) {
    const firstError = zodFieldErrors[key]?.[0];
    if (firstError) {
      result[key] = firstError;
    }
  }
  return result;
}
