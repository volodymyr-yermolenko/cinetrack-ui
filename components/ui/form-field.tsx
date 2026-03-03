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
    <div>
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
        className="form-input"
      />
      {props.error && (
        <p className="text-red-500 text-sm mt-1">{props.error}</p>
      )}
    </div>
  );
}
