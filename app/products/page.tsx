import { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import SearchFilterForm from "@/components/SearchFilterForm";
import { fetchAllProducts, fetchCategories, searchProducts } from "@/lib/api";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Products | Product Catalog",
  description: "Browse our collection of products",
};

/**
 * Revalidation configuration for SSG with ISR.
 * When no searchParams are present, page is statically generated
 * and revalidated every hour (3600 seconds).
 */
export const revalidate = 3600;

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

/**
 * Product Catalog Page
 *
 * Rendering Strategy:
 * - Without searchParams: SSG with Time-based Revalidation (3600s)
 *   This ensures optimal initial load performance and SEO.
 * - With searchParams: Dynamic Server Rendering (DSR)
 *   Triggered automatically when URL contains search/filter params,
 *   providing fresh, filtered results for each query.
 */
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search;
  const category = params.category;

  const categories = await fetchCategories();

  // Fetch products based on search/filter params
  // If params exist, this triggers dynamic rendering
  const products =
    search || category
      ? await searchProducts(search, category)
      : await fetchAllProducts();

  return (
    <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Products</h1>

          <SearchFilterForm categories={categories} />

          {products.length === 0 ? (
            <div className={styles.empty}>
              <p>No products found matching your criteria.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
    </main>
  );
}
