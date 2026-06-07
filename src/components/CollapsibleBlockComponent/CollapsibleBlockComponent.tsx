import { useState, ReactNode, MouseEvent } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import styles from "./CollapsibleBlockComponent.module.css";
import { useComponents } from "../ComponentsProvider.js";
import SoundService from "../../services/SoundService.js";

export interface CollapsibleBlockComponentProps {
  icon?: ReactNode;
  label: string | ReactNode;
  badge?: ReactNode;
  defaultCollapsed?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  headerActions?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * CollapsibleBlockComponent — A disclosure widget with chevron toggle.
 *
 * Wraps any content behind a clickable header with an icon, label,
 * and optional badge. Supports both controlled and uncontrolled modes.
 */
export default function CollapsibleBlockComponent({
  icon,
  label,
  badge,
  defaultCollapsed = false,
  open: controlledOpen,
  onToggle,
  headerActions,
  className = "",
  children,
}: CollapsibleBlockComponentProps) {
  const { sound } = useComponents();
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  /* Support both controlled and uncontrolled modes */
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : !internalCollapsed;

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (sound) SoundService.playClick({ event });
    if (isControlled) {
      onToggle?.(!controlledOpen);
    } else {
      setInternalCollapsed((previous) => !previous);
    }
  };

  return (
    <div className={`collapsible-block-component ${styles['container']} ${className}`}>
      <button className={styles['header']} onClick={handleToggle}>
        <span className={styles['chevron']}>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        {icon && <span className={styles['icon']}>{icon}</span>}
        <span className={styles['label']}>{label}</span>
        {badge && <span className={styles['badge']}>{badge}</span>}
        {headerActions && (
          <div className={styles['actions']} onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
            {headerActions}
          </div>
        )}
      </button>
      {isOpen && <div className={styles['body']}>{children}</div>}
    </div>
  );
}
