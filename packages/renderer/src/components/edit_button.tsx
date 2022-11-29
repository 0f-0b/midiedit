import React, { type ComponentPropsWithoutRef } from "react";
import classes from "./edit_button.module.css";

export function AddButton(
  props: Omit<ComponentPropsWithoutRef<"button">, "className">,
): JSX.Element {
  return <button className={classes.editButton} {...props}>＋</button>;
}

export function RemoveButton(
  props: Omit<ComponentPropsWithoutRef<"button">, "className">,
): JSX.Element {
  return <button className={classes.editButton} {...props}>－</button>;
}
