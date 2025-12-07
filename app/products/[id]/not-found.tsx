import Link from "next/link";
import styles from "./not-found.module.css";

/**
 * Custom 404 page for product not found.
 * Displayed when notFound() is called in the product page.
 */
export default function ProductNotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Product Not Found</h1>
        <p className={styles.message}>
          Sorry, the product you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link href="/products" className={styles.button}>
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}


