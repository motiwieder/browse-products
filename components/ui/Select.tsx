// components/ui/Select.tsx
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  label?: string;
  className?: string;
}

/**
 * Generic dropdown select with loading state
 */
export default function Select({
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  isLoading = false,
  label,
  className,
}: SelectProps) {
  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.select}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isLoading && (
        <div className={styles.spinnerWrapper} aria-hidden="true">
          <span className={styles.spinner} />
        </div>
      )}
    </div>
  );
}

