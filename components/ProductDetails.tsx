import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import styles from "./ProductDetails.module.css";
import StarRating from "./StarRating";

const DETAIL_IMAGE_SIZE = 400;

interface ProductDetailsProps {
  product: Product;
}

/**
 * Displays full product information on the single product page.
 */
export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <article className={styles.container}>
      <Link href="/products" className={styles.backLink}>
        ← Back to Products
      </Link>

      <div className={styles.product}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={product.image}
              alt={product.title}
              width={DETAIL_IMAGE_SIZE}
              height={DETAIL_IMAGE_SIZE}
              className={styles.image}
              priority
            />
          </div>
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.rating}>
            <StarRating rating={product.rating.rate} size="md" />
            <span className={styles.ratingText}>
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          <p className={styles.price}>${product.price.toFixed(2)}</p>

          <div className={styles.description}>
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
