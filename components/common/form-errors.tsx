interface FormErrorsProps {
  errors: string[] | undefined;
  className?: string;
}

export default function FormErrors({ errors, className }: FormErrorsProps) {
  if (!errors?.length) {
    return null;
  }
  return (
    <div className={className}>
      {errors.map((error, index) => (
        <p key={index} className="text-red-500 text-sm">
          {error}
        </p>
      ))}
    </div>
  );
}
