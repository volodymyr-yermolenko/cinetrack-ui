type FormFieldType = "text" | "number";

interface FormFieldProps {
  fieldType: FormFieldType;
  label: string;
  name: string;
  value?: string;
  placeHolder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function FormField(props: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.name} className="font-semibold">
        {props.label}
        {props.required && <span> *</span>}
      </label>
      <input
        type={props.fieldType}
        id={props.name}
        name={props.name}
        value={props.value ?? ""}
        placeholder={props.placeHolder}
        onChange={props.onChange}
        className="form-input w-full"
      />
      {props.error && (
        <p className="text-red-500 text-sm mt-1">{props.error}</p>
      )}
    </div>
  );
}
