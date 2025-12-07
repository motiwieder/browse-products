"use client";
import { useEffect } from "react";
import styles from "./error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary Component.
 * Handles API fetch failures and other runtime errors.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Something went wrong!</h2>
        <p className={styles.message}>
          We are unable to load the products. This might be a temporary issue.
        </p>
        {error.message && (
          <p className={styles.errorDetail}>
            Error: {error.message}
          </p>
        )}
        <button onClick={reset} className={styles.button}>
          Try Again
        </button>
      </div>
    </div>
  );
}
