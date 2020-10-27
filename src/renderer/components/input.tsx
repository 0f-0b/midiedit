import * as React from "react";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export const Input = React.forwardRef(function Input({ label, ...props }: InputProps, ref: React.Ref<HTMLInputElement>): JSX.Element {
  return label === undefined
    ? <input {...props} ref={ref} />
    : <label>{label}<input {...props} ref={ref} /></label>;
});
