import type { ComponentPropsWithoutRef } from "react";
import * as React from "react";
import classes from "./edit-button.module.css";

export function AddButton(props: Omit<ComponentPropsWithoutRef<"button">, "className">): JSX.Element {
  return <button className={classes.editButton} {...props}>＋</button>;
}

export function RemoveButton(props: Omit<ComponentPropsWithoutRef<"button">, "className">): JSX.Element {
  return <button className={classes.editButton} {...props}>－</button>;
}
