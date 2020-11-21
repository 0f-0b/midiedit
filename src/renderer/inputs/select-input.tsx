export interface SelectInputProps extends Omit<React.ComponentPropsWithoutRef<"select">, "onChange"> {
  value: number;
  options: readonly string[];
  onChange: (value: number) => void;
}

export function SelectInput({ value, options, onChange, ...props }: SelectInputProps): JSX.Element {
  return <select value={value} onChange={event => onChange(parseInt(event.target.value, 10))} {...props}>
    {options.map((option, index) => <option key={index} value={index}>{option}</option>)}
  </select>;
}
