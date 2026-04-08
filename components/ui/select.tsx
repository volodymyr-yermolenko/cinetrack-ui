import ReactSelect, { CSSObjectWithLabel, StylesConfig } from "react-select";
import { SelectOption } from "@/lib/utils/sys-utils";

interface SelectProps<T extends number | string> {
  id: string;
  name: string;
  className?: string;
  options: SelectOption<T>[];
  value: T | null;
  onChange: (selectedValue: T | null) => void;
}

const customStyles: StylesConfig<SelectOption<any>, false> = {
  control: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    minHeight: 42,
    height: 42,
    borderRadius: "8px",
  }),
};

export default function Select<T extends number | string>(
  props: SelectProps<T>,
) {
  const selectedOption =
    props.options.find((option) => option.value === props.value) || null;

  return (
    <ReactSelect
      instanceId={props.id}
      inputId={props.id}
      name={props.name}
      className={props.className}
      styles={customStyles}
      value={selectedOption}
      onChange={(option) => {
        props.onChange(option?.value ?? null);
      }}
      options={props.options}
    />
  );
}
