import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  customClass?: string;
  children?: ReactNode;
}

export declare const Card: React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
>;

export interface CardSwapItem {
  title?: string;
  image?: string;
  alt?: string;
  icon?: ReactNode;
}

export interface CardSwapProps {
  items?: CardSwapItem[];
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  depth?: number;
  skewAmount?: number;
  visibleCards?: number;
  delay?: number;
  autoplay?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  speed?: number;
  bounce?: number;
  parallax?: number;
  hoverSpread?: number;
  dim?: number;
  cardRadius?: number;
  intro?: boolean;
  theme?: "dark" | "light";
  onCardClick?: (index: number) => void;
  onChange?: (index: number) => void;
  className?: string;
  children?: ReactNode;
}

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
}

declare const CardSwap: React.ForwardRefExoticComponent<
  CardSwapProps & React.RefAttributes<CardSwapHandle>
>;
export default CardSwap;
