import { ReactNode, forwardRef } from "react";
import styles from "./LayoutHeaderComponent.module.css";

export interface LayoutHeaderToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  visibleIcon: ReactNode;
  hiddenIcon: ReactNode;
  label?: string;
}

export interface LayoutHeaderComponentProps {
  leadingToggle?: LayoutHeaderToggleButtonProps;
  trailingToggle?: LayoutHeaderToggleButtonProps;
  centerContent?: ReactNode;
  metaContent?: ReactNode;
  controls?: ReactNode;
  isMobile?: boolean;
  className?: string;
  children?: ReactNode;
}

const LayoutHeaderComponent = forwardRef<HTMLElement, LayoutHeaderComponentProps>(
  function LayoutHeaderComponent(
    {
      leadingToggle,
      trailingToggle,
      centerContent,
      metaContent,
      controls,
      isMobile = false,
      className,
      children,
    },
    ref,
  ) {
    return (
      <>
        <header
          ref={ref}
          className={`${styles["layout-header-container"]}${className ? ` ${className}` : ""}`}
        >
          {leadingToggle && (
            <button
              className={`${styles["header-toggle-button"]} ${!leadingToggle.isVisible ? styles["is-panel-hidden"] : ""}`}
              onClick={leadingToggle.onToggle}
              title={
                leadingToggle.isVisible
                  ? `Hide ${leadingToggle.label || "panel"}`
                  : `Show ${leadingToggle.label || "panel"}`
              }
            >
              {leadingToggle.isVisible
                ? leadingToggle.visibleIcon
                : leadingToggle.hiddenIcon}
            </button>
          )}

          {!isMobile && metaContent}

          {centerContent && (
            <div className={styles["header-center-area"]}>
              {centerContent}
            </div>
          )}

          {controls}

          {children}

          {trailingToggle && (
            <button
              className={`${styles["header-toggle-button"]} ${!trailingToggle.isVisible ? styles["is-panel-hidden"] : ""}`}
              onClick={trailingToggle.onToggle}
              title={
                trailingToggle.isVisible
                  ? `Hide ${trailingToggle.label || "panel"}`
                  : `Show ${trailingToggle.label || "panel"}`
              }
            >
              {trailingToggle.isVisible
                ? trailingToggle.visibleIcon
                : trailingToggle.hiddenIcon}
            </button>
          )}
        </header>

        {isMobile && metaContent && (
          <div className={styles["mobile-metadata-bar"]}>
            {metaContent}
          </div>
        )}
      </>
    );
  },
);

export default LayoutHeaderComponent;

export { styles as layoutHeaderStyles };
