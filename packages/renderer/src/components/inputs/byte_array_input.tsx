import React from "react";
import classes from "./input.module.css";

export interface ByteArrayInputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "value" | "onChange"> {
  value: Uint8Array;
  onChange: (value: Uint8Array) => void;
}

export function ByteArrayInput(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { value, onChange, ...props }: ByteArrayInputProps,
): JSX.Element {
  return (
    <input
      className={classes.input}
      value="unimplemented"
      readOnly
      {...props}
    />
  );
}
