import * as React from "react";
import { ByteArrayInput } from "./inputs/byte-array-input";
import { IntegerInput } from "./inputs/integer-input";
import { SelectInput } from "./inputs/select-input";
import { StringInput } from "./inputs/string-input";
import classes from "./properties-editor.module.css";

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

export interface PropertiesEditorProps extends React.ComponentPropsWithoutRef<"div"> {
  properties: { [id: string]: Property; };
}

export function PropertiesEditor({ properties, ...props }: PropertiesEditorProps): JSX.Element {
  return <div {...props}>
    {Object.entries(properties).map(([id, property]) => <label key={id} className={classes.label}>
      {property.label}
      {(() => {
        switch (property.type) {
          case "string":
            return <StringInput value={property.value} onChange={property.onChange} />;
          case "integer":
            return <IntegerInput value={property.value} min={property.min} max={property.max} onChange={property.onChange} />;
          case "select":
            return <SelectInput value={property.value} options={property.options} onChange={property.onChange} />;
          case "byte-array":
            return <ByteArrayInput value={property.value} onChange={property.onChange} />;
        }
      })()}
    </label>)}
  </div>;
}
