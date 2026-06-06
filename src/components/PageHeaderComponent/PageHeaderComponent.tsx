import { ReactNode, useEffect } from "react";
import { usePageHeaderContext } from "../PageHeaderContext.js";
import { ArrowLeft } from "lucide-react";
import styles from "./PageHeaderComponent.module.css";

export interface PageHeaderComponentProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  onBack?: () => void;
  centerContent?: ReactNode;
  children?: ReactNode;
  sticky?: boolean;
  className?: string;
}

/**
 * PageHeaderComponent — When used inside a PageLayoutComponent, pushes
 * page identity (title, subtitle, back) up to LayoutHeaderComponent
 * via context, and renders only the action children inline.
 *
 * When used standalone (no context provider), falls back to rendering
 * the classic pageHeader bar with title/subtitle/back inline.
 */
export default function PageHeaderComponent({
  title,
  subtitle,
  onBack,
  centerContent,
  children,
  sticky = true,
  className,
}: PageHeaderComponentProps) {
  const setIdentity = usePageHeaderContext();

  useEffect(() => {
    if (setIdentity) {
      setIdentity({ title, onBack });
    }

    return () => {
      if (setIdentity) {
        setIdentity({});
      }
    };
  }, [title, subtitle, onBack, setIdentity]);

  // Context-driven mode: identity is pushed to LayoutHeaderComponent,
  // only render the action children inline.
  if (setIdentity) {
    const hasContent = children || centerContent;
    if (!hasContent) return null;

    return (
      <div className={styles['header-actions']}>
        {centerContent && <div className={styles['header-center']}>{centerContent}</div>}
        {children}
      </div>
    );
  }

  // Standalone fallback: render the full pageHeader bar.
  return (
    <header
      className={`${styles['page-header']} ${sticky ? styles.sticky : ""} ${className || ""}`}
    >
      <div className={styles['header-left']}>
        {onBack && (
          <button className={styles['back-button']} onClick={onBack}>
            <ArrowLeft size={16} />
          </button>
        )}
        <div>
          <h1 className={styles['page-title']}>{title}</h1>
          {subtitle && <p className={styles['page-subtitle']}>{subtitle}</p>}
        </div>
      </div>

      {centerContent && (
        <div className={styles['header-center']}>{centerContent}</div>
      )}

      {children && <div className={styles['header-actions']}>{children}</div>}
    </header>
  );
}
