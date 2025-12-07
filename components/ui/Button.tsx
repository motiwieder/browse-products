// components/ui/Button.tsx
import { ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Generic button with variant styles and loading state
 */
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  isLoading = false,
  loadingText,
  className,
  ariaLabel,
}: ButtonProps) {
  const variantClass = styles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${variantClass} ${className ?? ""}`}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={isLoading ? styles.loadingText : ""}>
        {isLoading && loadingText ? loadingText : children}
      </span>
    </button>
  );
}

