import * as React from "react";

export function AddButton(props: Omit<React.ComponentPropsWithoutRef<"button">, "className">): JSX.Element {
  return <button className="edit-button" {...props}>＋</button>;
}

export function RemoveButton(props: Omit<React.ComponentPropsWithoutRef<"button">, "className">): JSX.Element {
  return <button className="edit-button" {...props}>－</button>;
}
