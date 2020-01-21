import * as React from "react";
import { ComponentPropsWithoutRef, ReactNode } from "react";

export interface TextInputProps  extends Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange"> {
  value: string;
  validate?: ((value: string) => boolean) | RegExp;
  onChange: (value: string) => void;
}

export interface TextInputState {
  value: string;
}

export default class TextInput extends React.Component<TextInputProps, TextInputState> {
  public constructor(props: TextInputProps) {
    super(props);
    this.state = { value: props.value };
  }

  public render(): ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, validate, onChange, ...props } = this.props;
    return <input value={this.state.value}
      onChange={event => {
        const value = event.target.value;
        const valid = !validate || (typeof validate === "function" ? validate(value) : validate.test(value));
        event.target.setCustomValidity(valid ? "" : "invalid");
        if (valid) onChange(value);
        this.setState({ value });
      }}
      {...props} />;
  }
}
