import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import styles from "./ProductCard.module.css";

const CARD_IMAGE_SIZE = 200;

interface ProductCardProps {
  product: Product;
}

/**
 * Displays a single product in a card format.
 * Used in the product catalog grid.
 */
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.title}
          width={CARD_IMAGE_SIZE}
          height={CARD_IMAGE_SIZE}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <span className={styles.rating}>
            ★ {product.rating.rate} ({product.rating.count})
          </span>
        </div>
      </div>
    </Link>
  );
}
