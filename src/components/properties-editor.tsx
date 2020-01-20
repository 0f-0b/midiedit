import * as React from "react";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { __ } from "../i18n";
import { mergeClass } from "./props";

export abstract class Property<T> {
  public constructor(
    public readonly value: T,
    public readonly onChange: (value: T) => void) { }

  public abstract render(): ReactNode;
}

export class BooleanProperty extends Property<boolean> {
  public render(): ReactNode {
    return <input type="checkbox" checked={this.value}
      onChange={event => this.onChange(event.target.checked)} />;
  }
}

export class StringProperty extends Property<string> {
  public render(): ReactNode {
    return <input value={this.value}
      onChange={event => this.onChange(event.target.value)} />;
  }
}

export class IntegerProperty extends Property<number> {
  public constructor(value: number, onChange: (value: number) => void,
    public readonly min?: number,
    public readonly max?: number) {
    super(value, onChange);
  }

  public render(): ReactNode {
    return <input type="number" value={this.value} min={this.min} max={this.max}
      onChange={event => {
        const value = event.target.valueAsNumber;
        if (Number.isInteger(value)
          && (this.min === undefined || value >= this.min)
          && (this.max === undefined || value <= this.max)) this.onChange(value);
      }} />;
  }
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => boolean;
}

interface TextInputState {
  value: string;
  error: boolean;
}

class TextInput extends React.Component<TextInputProps, TextInputState> {
  public constructor(props: TextInputProps) {
    super(props);
    this.state = {
      value: props.value,
      error: false
    };
  }

  public render(): ReactNode {
    return <input value={this.state.value}
      style={{
        color: this.state.error ? "red" : undefined
      }}
      onChange={event => {
        const value = event.target.value;
        this.setState({
          value: value,
          error: !this.props.onChange(value)
        });
      }} />;
  }
}

export class ByteStringProperty extends Property<number[]> {
  public render(): ReactNode {
    const value = this.value;
    return <TextInput value={value.map(byte => byte.toString(16).padStart(2, "0")).join("")}
      onChange={value => {
        if (value.length & 1) return false;
        const length = value.length >>> 1;
        const result = new Array(length);
        for (let i = 0; i < length; i++)
          if (!Number.isInteger(result[i] = parseInt(value.substring(i << 1, (i << 1) | 1), 16))) return false;
        this.onChange(result);
        return true;
      }} />;
  }
}

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  options: readonly string[];
}

class Select extends React.Component<SelectProps> {
  public render(): ReactNode {
    const { options, ...props } = this.props;
    return <div className="select-wrapper">
      <select {...props}>{options.map((option, index) => <option key={index} value={index}>{option}</option>)}</select>
    </div>;
  }
}

export class SelectProperty extends Property<number> {
  public constructor(value: number, onChange: (value: number) => void,
    public readonly options: readonly string[]) {
    super(value, onChange);
  }

  public render(): ReactNode {
    return <Select options={this.options} value={this.value} onChange={event => this.onChange(event.target.selectedIndex)} />;
  }
}

export interface PropertiesEditorProps extends ComponentPropsWithoutRef<"div"> {
  properties: [string, Property<any>][];
}

export default class PropertiesEditor extends React.Component<PropertiesEditorProps> {
  public render(): ReactNode {
    const { properties, className, ...props } = this.props;
    return <div className={mergeClass("properties-editor", className)} {...props}>
      {properties.map(([id, property]) => <React.Fragment key={id}>
        <label>{__(`property.${id}`)}
          {property.render()}
        </label><br />
      </React.Fragment>)}
    </div>;
  }
}
