import * as React from "react";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { mergeClass } from "./props";

export interface SplitPaneProps extends ComponentPropsWithoutRef<"div"> {
  direction?: "row" | "column";
  first: ReactNode;
  second: ReactNode;
}

export default class SplitPane extends React.Component<SplitPaneProps> {
  public render(): ReactNode {
    const { direction, first, second, className, ...props } = this.props;
    return <div className={mergeClass("split-pane " + (direction ?? "row"), className)} {...props}>
      <div>{first}</div>
      <div>{second}</div>
    </div>;
  }
}
