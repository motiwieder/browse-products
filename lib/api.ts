/**
 * API utilities for fetching data from FakeStoreAPI.
 * All functions are designed to work with Next.js Server Components.
 */

import {
  API_BASE_URL,
  PRODUCT_REVALIDATE,
  CATALOG_REVALIDATE,
  CATEGORIES_REVALIDATE,
} from "./config";
import { Product } from "./types";

/**
 * Fetches all products from the API.
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    next: { revalidate: CATALOG_REVALIDATE },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

/**
 * Fetches a single product by ID.
 * Returns null if product is not found.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    next: { revalidate: PRODUCT_REVALIDATE },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch product");
  }

  const product = await response.json();
  return product || null; // FakeStoreAPI returns null for non-existent IDs
}

/**
 * Fetches all available product categories.
 */
export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/products/categories`, {
    next: { revalidate: CATEGORIES_REVALIDATE },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

/**
 * Fetches products filtered by category.
 * Revalidate every 1 hour, we will got fresh data by using search params.
 */
export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`,
    { next: { revalidate: CATALOG_REVALIDATE } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products by category");
  }

  return response.json();
}

/**
 * Searches and filters products based on query and category.
 * Filtering is done client-side since FakeStoreAPI doesn't support search.
 */
export async function searchProducts(
  query?: string,
  category?: string
): Promise<Product[]> {
  let products: Product[];

  // If category is specified, fetch only that category
  if (category) {
    products = await fetchProductsByCategory(category);
  } else {
    products = await fetchAllProducts();
  }

  // If search query is specified, filter by title
  if (query) {
    const lowerQuery = query.toLowerCase();
    products = products.filter((product) =>
      product.title.toLowerCase().includes(lowerQuery)
    );
  }

  return products;
}
