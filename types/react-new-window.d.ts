import { PureComponent } from "react";

export interface NewWindowProps {
  url?: string;
  name?: string;
  title?: string;
  features?: {
    height: number;
    width: number;
    [key: string]: boolean | number | string;
  };
  onBlock?: () => void | null;
  onUnload?: () => void | null;
  onOpen?: (window: Window) => void | null;
  center?: "parent" | "screen";
  copyStyles?: boolean;
}

export default class NewWindow extends PureComponent<NewWindowProps> {
  release(): void;
}
