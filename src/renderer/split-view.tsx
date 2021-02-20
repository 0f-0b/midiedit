import * as React from "react";
import { ReactNode } from "react";
import { mergeClass } from "./util";

export interface SplitViewProps extends React.ComponentPropsWithoutRef<"div"> {
  direction: "horizontal" | "vertical";
  children: [ReactNode, ReactNode];
}

export default function SplitView({ direction, children: [first, second], className, ...props }: SplitViewProps): JSX.Element {
  return <div className={mergeClass(`split-view ${direction}`, className)} {...props}>
    <div>{first}</div>
    <div>{second}</div>
  </div>;
}
