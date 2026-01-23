declare module "react-pageflip" {
  import * as React from "react";

  export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    mobileScrollSupport?: boolean;
    startPage?: number;

    // Props terbaru
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }

  export default class HTMLFlipBook extends React.Component<IProps> {
    flipNext(): void;
    flipPrev(): void;
    flipToPage(page: number): void;
  }
}
