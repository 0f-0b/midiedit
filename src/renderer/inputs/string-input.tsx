export interface StringInputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function StringInput({ value, onChange, ...props }: StringInputProps): JSX.Element {
  return <input value={value} onChange={event => onChange(event.target.value)} {...props} />;
}
