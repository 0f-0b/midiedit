import * as React from "react";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { __ } from "../i18n";
import IntegerInput from "./input/integer";
import TextInput from "./input/text";
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
    return <TextInput value={this.value} onChange={this.onChange} />;
  }
}

export class IntegerProperty extends Property<number> {
  public constructor(value: number, onChange: (value: number) => void,
    public readonly min?: number,
    public readonly max?: number) {
    super(value, onChange);
  }

  public render(): ReactNode {
    return <IntegerInput value={this.value} min={this.min} max={this.max} onChange={this.onChange}/>;
  }
}

export class ByteStringProperty extends Property<number[]> {
  public render(): ReactNode {
    return <TextInput value={this.value.map(byte => byte.toString(16).padStart(2, "0")).join("")}
      validate={/^(?:[0-9A-Fa-f]{2})*$/}
      onChange={value => {
        const length = value.length;
        const result = new Array(length >>> 1);
        for (let i = 0; i < length; i += 2)
          result[i] = parseInt(value.substring(i, i + 2), 16);
        this.onChange(result);
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
  keyPrefix?: string;
  properties: [string, Property<any>][];
}

export default class PropertiesEditor extends React.Component<PropertiesEditorProps> {
  public render(): ReactNode {
    const { keyPrefix, properties, className, ...props } = this.props;
    return <div className={mergeClass("properties-editor", className)} {...props}>
      {properties.map(([id, property]) => <React.Fragment key={keyPrefix ? keyPrefix + id : id}>
        <label>
          {__(`property.${id}`)}
          {property.render()}
        </label><br />
      </React.Fragment>)}
    </div>;
  }
}
