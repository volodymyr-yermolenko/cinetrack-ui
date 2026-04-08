export type SelectOption<T> = {
  value: T;
  label: string;
};

export function mapToNumericSelectOptions<T extends number>(
  map: Record<T, string>,
): SelectOption<T>[] {
  return Object.entries(map).map(([value, label]) => {
    return {
      value: Number(value) as T,
      label: label as string,
    };
  });
}

export function mapToStringSelectOptions<T extends string>(
  map: Record<T, string>,
): SelectOption<T>[] {
  return Object.entries(map).map(([value, label]) => {
    return {
      value: value as T,
      label: label as string,
    };
  });
}
