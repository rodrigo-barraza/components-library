import { ReactNode, ComponentPropsWithoutRef, MouseEvent } from "react";
import styles from "./IconButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

export interface IconButtonComponentProps extends ComponentPropsWithoutRef<"button"> {
  icon: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  tooltip?: string;
  variant?: "default" | "destructive";
  active?: boolean;
  hoverReveal?: boolean;
}

/**
 * IconButtonComponent — A small icon-only action button.
 */
export default function IconButtonComponent({
  icon,
  onClick,
  tooltip,
  variant = "default",
  active = false,
  hoverReveal = false,
  disabled = false,
  className,
  ...rest
}: IconButtonComponentProps) {
  const { sound } = useComponents();

  const classes = [
    styles.iconButton,
    variant === "destructive" ? styles.destructive : "",
    active ? styles.active : "",
    hoverReveal ? styles.hoverReveal : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={(e) => {
        if (sound) SoundService.playClickButton({ event: e });
        onClick?.(e);
      }}
      onMouseEnter={(e) => {
        if (sound) SoundService.playHoverButton({ event: e });
      }}
      title={tooltip}
      disabled={disabled}
      {...rest}
    >
      {icon}
    </button>
  );
}
