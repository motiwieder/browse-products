import Link from "next/link";
import styles from "./not-found.module.css";

/**
 * Global 404 Not Found Page.
 * Displayed when a route doesn't exist.
 */
export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className={styles.links}>
          <Link href="/" className={styles.primaryLink}>
            Go Home
          </Link>
          <Link href="/products" className={styles.secondaryLink}>
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
