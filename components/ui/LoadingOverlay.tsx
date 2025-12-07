// components/ui/LoadingOverlay.tsx
import styles from "./LoadingOverlay.module.css";

interface LoadingOverlayProps {
  isVisible: boolean;
  spinnerLabel?: string;
}

/**
 * Full-coverage loading overlay with centered spinner
 */
export default function LoadingOverlay({
  isVisible,
  spinnerLabel = "Loading...",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} aria-label={spinnerLabel} role="status" />
    </div>
  );
}

