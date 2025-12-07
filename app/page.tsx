import Link from "next/link";
import styles from "./page.module.css";

/**
 * Home Page
 * Rendering Strategy: SSG (Static Site Generation)
 * This page contains only static content and is pre-rendered at build time.
 */
export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>HELLO WORLD</h1>
      <p className={styles.description}>Welcome to our product catalog</p>
      <Link href="/products" className={styles.link}>
        Browse Products
      </Link>
    </main>
  );
}
