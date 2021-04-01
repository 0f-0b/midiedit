import * as React from "react";
import classes from "./input.module.css";

export interface StringInputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function StringInput({ value, onChange, ...props }: StringInputProps): JSX.Element {
  return <input className={classes.input} value={value} onChange={event => onChange(event.target.value)} {...props} />;
}
