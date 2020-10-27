import * as React from "react";
import { IntegerInput } from "./properties/integer-input";
import { SelectInput } from "./properties/select-input";
import { StringInput } from "./properties/string-input";

export interface StringProperty {
  type: "string";
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export interface IntegerProperty {
  type: "integer";
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export interface SelectProperty {
  type: "select";
  label: string;
  options: readonly string[];
  value: number;
  onChange: (value: number) => void;
}

export interface ByteArrayProperty {
  type: "byte-array";
  label: string;
  value: Uint8Array;
  onChange: (value: Uint8Array) => void;
}

export type Property =
  | StringProperty
  | IntegerProperty
  | SelectProperty
  | ByteArrayProperty;
type PropertyByType<T extends Property["type"]> =
  T extends "string" ? StringProperty :
  T extends "integer" ? IntegerProperty :
  T extends "select" ? SelectProperty :
  T extends "byte-array" ? ByteArrayProperty :
  never;

const propertyTypes: {
  [T in Property["type"]]: (property: PropertyByType<T>) => JSX.Element;
} = {
  "string"(property: StringProperty) {
    return <label>
      {property.label}
      <StringInput value={property.value} onChange={property.onChange} />
    </label>;
  },
  "integer"(property: IntegerProperty) {
    return <label>
      {property.label}
      <IntegerInput value={property.value} min={property.min} max={property.max} onChange={property.onChange} />
    </label>;
  },
  "select"(property: SelectProperty) {
    return <label>
      {property.label}
      <SelectInput value={property.value} options={property.options} onChange={property.onChange} />
    </label>;
  },
  "byte-array"(property: ByteArrayProperty) {
    return <label>
      {property.label}
      <input value="unimplemented" readOnly />
    </label>;
  }
};

interface PropertyEditorProps {
  property: Property;
}

function PropertyEditor({ property }: PropertyEditorProps): JSX.Element {
  return propertyTypes[property.type](property as never);
}

export interface PropertiesEditorProps extends React.ComponentPropsWithoutRef<"div"> {
  properties: { [id: string]: Property; };
}

export function PropertiesEditor({ properties, ...props }: PropertiesEditorProps): JSX.Element {
  return <div {...props}>
    {Object.entries(properties).map(([id, property]) => <PropertyEditor property={property} key={id} />)}
  </div>;
}
