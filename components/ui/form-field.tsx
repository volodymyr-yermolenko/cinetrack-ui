export enum FormFieldType {
  Text = "text",
  Number = "number",
}

interface FormFieldProps {
  fieldType: FormFieldType;
  label: string;
  name: string;
  value?: string;
  placeHolder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function FormField(props: FormFieldProps) {
  return (
    <div>
      <label htmlFor={props.name} className="font-semibold">
        {props.label}
      </label>
      <input
        type={props.fieldType === FormFieldType.Number ? "number" : "text"}
        id={props.name}
        name={props.name}
        value={props.value || ""}
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
