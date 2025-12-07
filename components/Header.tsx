import Link from 'next/link';
import styles from './Header.module.css';

/**
 * Navigation header component.
 * Provides consistent navigation across all pages.
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Product Catalog
        </Link>
        <ul className={styles.links}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}


