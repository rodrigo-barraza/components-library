import { ReactNode, ComponentPropsWithoutRef, MouseEvent } from "react";
import styles from "./IconButtonComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

export interface IconButtonComponentProps extends ComponentPropsWithoutRef<"button"> {
  icon: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
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
    active ? styles.isActiveState : "",
    hoverReveal ? styles.hoverReveal : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={(event) => {
        if (sound) SoundService.playClickButton({ event });
        onClick?.(event);
      }}
      onMouseEnter={(event) => {
        if (sound) SoundService.playHoverButton({ event });
      }}
      title={tooltip}
      disabled={disabled}
      {...rest}
    >
      {icon}
    </button>
  );
}
