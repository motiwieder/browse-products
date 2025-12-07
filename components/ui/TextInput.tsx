// components/ui/TextInput.tsx
import { ReactNode } from "react";
import styles from "./TextInput.module.css";

interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: "text" | "email" | "password" | "tel" | "url";
  disabled?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  label?: string;
  className?: string;
}

/**
 * Generic text input with optional leading icon and loading spinner
 */
export default function TextInput({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  type = "text",
  disabled = false,
  isLoading = false,
  icon,
  label,
  className,
}: TextInputProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <div className={styles.container}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${styles.input} ${icon ? styles.withIcon : ""}`}
          maxLength={maxLength}
          disabled={disabled || isLoading}
          aria-busy={isLoading}
        />
        {isLoading && (
          <div className={styles.spinnerWrapper} aria-hidden="true">
            <span className={styles.spinner} />
          </div>
        )}
      </div>
    </div>
  );
}

