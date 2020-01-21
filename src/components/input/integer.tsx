import * as React from "react";
import { ComponentPropsWithoutRef, ReactNode } from "react";

export interface IntegerInputProps extends Omit<ComponentPropsWithoutRef<"input">, "value" | "min" | "max" | "onChange"> {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export interface IntegerInputState {
  value: string;
}

export default class NumberInput extends React.Component<IntegerInputProps, IntegerInputState> {
  public constructor(props: IntegerInputProps) {
    super(props);
    this.state = { value: props.value.toString() };
  }

  public render(): ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, min, max, onChange, ...props } = this.props;
    return <input type="number" value={this.state.value} min={min} max={max}
      onChange={event => {
        const value = event.target.value;
        const intValue = parseInt(value, 10);
        const valid = Number.isInteger(intValue)
          && (min === undefined || intValue >= min)
          && (max === undefined || intValue <= max);
        event.target.setCustomValidity(valid ? "" : "invalid");
        if (valid) onChange(intValue);
        this.setState({ value });
      }}
      {...props} />;
  }
}
