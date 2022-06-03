import React, { type ReactNode } from "react";
import { mergeClass } from "../util";
import classes from "./split-view.module.css";

const classNames = Object.freeze<Record<SplitViewProps["direction"], string>>({
  horizontal: classes.horizontalSplitView,
  vertical: classes.verticalSplitView
});

export interface SplitViewProps extends React.ComponentPropsWithoutRef<"div"> {
  direction: "horizontal" | "vertical";
  children: [ReactNode, ReactNode];
}

export function SplitView({ direction, children: [first, second], className, ...props }: SplitViewProps): JSX.Element {
  return <div className={mergeClass(classNames[direction], className)} {...props}>
    <div>{first}</div>
    <div>{second}</div>
  </div>;
}
