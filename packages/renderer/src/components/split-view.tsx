import type { ReactNode } from "react";
import * as React from "react";
import { mergeClass } from "../util";
import classes from "./split-view.module.css";

export interface SplitViewProps extends React.ComponentPropsWithoutRef<"div"> {
  direction: "horizontal" | "vertical";
  children: [ReactNode, ReactNode];
}

const classNames = Object.freeze(Object.assign<unknown, { [K in SplitViewProps["direction"]]: string }>(Object.create(null), {
  horizontal: classes.horizontalSplitView,
  vertical: classes.verticalSplitView
}));

export default function SplitView({ direction, children: [first, second], className, ...props }: SplitViewProps): JSX.Element {
  return <div className={mergeClass(classNames[direction], className)} {...props}>
    <div>{first}</div>
    <div>{second}</div>
  </div>;
}
