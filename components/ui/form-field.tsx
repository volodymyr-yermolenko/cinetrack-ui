interface BaseFormFieldProps {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

interface TextInputFormFieldProps extends BaseFormFieldProps {
  fieldType: "text" | "number";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TextAreaFormFieldProps extends BaseFormFieldProps {
  fieldType: "textarea";
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

type FormFieldProps = TextInputFormFieldProps | TextAreaFormFieldProps;

export function FormField(props: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.name} className="font-semibold">
        {props.label}
        {props.required && <span> *</span>}
      </label>
      {props.fieldType === "textarea" ? (
        <textarea
          id={props.name}
          name={props.name}
          value={props.value ?? ""}
          placeholder={props.placeholder}
          onChange={props.onChange}
          className="form-input w-full"
          rows={props.rows}
          style={{ resize: "none" }}
        />
      ) : (
        <input
          type={props.fieldType}
          id={props.name}
          name={props.name}
          value={props.value ?? ""}
          placeholder={props.placeholder}
          onChange={props.onChange}
          className="form-input w-full"
        />
      )}
      {props.error && (
        <p className="text-red-500 text-sm mt-1">{props.error}</p>
      )}
    </div>
  );
}
