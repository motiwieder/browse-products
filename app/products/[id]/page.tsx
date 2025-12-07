import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ProductDetails from "@/components/ProductDetails";
import { fetchProductById, fetchAllProducts } from "@/lib/api";
import { PRODUCT_REVALIDATE } from "@/lib/config";

const META_DESCRIPTION_MAX_LENGTH = 160;

/**
 * Revalidation configuration for SSG with ISR.
 * Individual product pages are revalidated every 24 hours (86400 seconds).
 */
export const revalidate = PRODUCT_REVALIDATE;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate static params for all products at build time.
 * This pre-renders all product pages for optimal performance and SEO.
 */
export async function generateStaticParams() {
  const products = await fetchAllProducts();

  return products.map((product) => ({
    id: String(product.id),
  }));
}

/**
 * Generate dynamic metadata for each product page.
 * Improves SEO by providing unique titles and descriptions.
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} | Product Catalog`,
    description: product.description.slice(0, META_DESCRIPTION_MAX_LENGTH),
  };
}

/**
 * Single Product Page
 *
 * Rendering Strategy: SSG with Time-based Revalidation (86400s)
 * - generateStaticParams pre-renders all 20 products at build time
 * - Pages are cached and revalidated daily for freshness
 * - Excellent performance and SEO since pages are pre-built
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <ProductDetails product={product} />
    </>
  );
}
