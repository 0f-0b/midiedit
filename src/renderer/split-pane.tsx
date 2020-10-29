import * as React from "react";
import { ReactNode } from "react";
import { mergeClass } from "./util";

export interface SplitPaneProps extends React.ComponentPropsWithoutRef<"div"> {
  direction?: "row" | "column";
  first: ReactNode;
  second: ReactNode;
}

export default function SplitPane({ direction, first, second, className, ...props }: SplitPaneProps): JSX.Element {
  return <div className={mergeClass("split-pane " + (direction ?? "row"), className)} {...props}>
    <div>{first}</div>
    <div>{second}</div>
  </div>;
}
