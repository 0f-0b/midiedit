import React from "react";

export interface ByteArrayInputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "value" | "onChange"> {
  value: Uint8Array;
  onChange: (value: Uint8Array) => void;
}

export function ByteArrayInput(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { value, onChange, ...props }: ByteArrayInputProps,
): JSX.Element {
  return <span {...props}>sorry, unimplemented</span>;
}
