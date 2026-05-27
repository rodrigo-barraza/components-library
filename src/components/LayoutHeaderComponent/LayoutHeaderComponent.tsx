import { ReactNode, forwardRef, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import styles from "./LayoutHeaderComponent.module.css";

export interface LayoutHeaderToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  visibleIcon: ReactNode;
  hiddenIcon: ReactNode;
  label?: string;
}

export interface LayoutHeaderComponentProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  onBack?: () => void;
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
      title,
      subtitle,
      onBack,
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
    const headerReference = useRef<HTMLElement>(null);

    // Programmatic contrast color for header content based on --accent-primary luminance
    useEffect(() => {
      const headerElement = headerReference.current;
      if (!headerElement) return;

      const computeAndApplyContrastColor = () => {
        const computedStyle = getComputedStyle(headerElement);
        const backgroundColorValue = computedStyle.backgroundColor;

        const redGreenBlueMatch = backgroundColorValue.match(
          /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
        );
        if (!redGreenBlueMatch) return;

        const redChannel = parseInt(redGreenBlueMatch[1], 10);
        const greenChannel = parseInt(redGreenBlueMatch[2], 10);
        const blueChannel = parseInt(redGreenBlueMatch[3], 10);

        const toLinearComponent = (channelValue: number): number => {
          const normalizedValue = channelValue / 255;
          return normalizedValue <= 0.03928
            ? normalizedValue / 12.92
            : Math.pow((normalizedValue + 0.055) / 1.055, 2.4);
        };

        const relativeLuminance =
          0.2126 * toLinearComponent(redChannel) +
          0.7152 * toLinearComponent(greenChannel) +
          0.0722 * toLinearComponent(blueChannel);

        const isLightBackground = relativeLuminance > 0.179;

        headerElement.style.setProperty(
          "--header-contrast-color",
          isLightBackground ? "rgba(0, 0, 0, 0.87)" : "rgba(255, 255, 255, 0.92)"
        );
        headerElement.style.setProperty(
          "--header-contrast-color-muted",
          isLightBackground ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.55)"
        );
        headerElement.style.setProperty(
          "--header-contrast-border",
          isLightBackground ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)"
        );
        headerElement.style.setProperty(
          "--header-contrast-hover-background",
          isLightBackground ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"
        );
      };

      computeAndApplyContrastColor();

      const mutationObserver = new MutationObserver(computeAndApplyContrastColor);
      mutationObserver.observe(headerElement, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      const documentObserver = new MutationObserver(computeAndApplyContrastColor);
      documentObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });

      return () => {
        mutationObserver.disconnect();
        documentObserver.disconnect();
      };
    }, []);
    return (
      <>
        <header
          ref={(node) => {
            (headerReference as React.MutableRefObject<HTMLElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
          }}
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

          {title && (
            <div className={styles["header-identity"]}>
              {onBack && (
                <button className={styles["header-back-button"]} onClick={onBack} title="Go back">
                  <ArrowLeft size={16} />
                </button>
              )}
              <div className={styles["header-identity-text"]}>
                <h1 className={styles["header-page-title"]}>{title}</h1>
                {subtitle && <p className={styles["header-page-subtitle"]}>{subtitle}</p>}
              </div>
            </div>
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
