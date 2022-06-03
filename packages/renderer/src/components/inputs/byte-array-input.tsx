import React from "react";
import classes from "./input.module.css";

export interface ByteArrayInputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "value" | "onChange"> {
  value: Uint8Array;
  onChange: (value: Uint8Array) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ByteArrayInput({ value, onChange, ...props }: ByteArrayInputProps): JSX.Element {
  return <input className={classes.input} value="unimplemented" readOnly {...props} />;
}
