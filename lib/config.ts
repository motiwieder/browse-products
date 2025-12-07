/**
 * Centralized configuration for revalidation times and shared constants.
 * This makes it easy to maintain and adjust caching strategies.
 */

/**
 * Revalidation time for the product catalog page (1 hour)
 * Balances SEO/performance with data freshness
 */
export const CATALOG_REVALIDATE = 3600;

/**
 * Revalidation time for individual product pages (24 hours)
 * Products change less frequently, so longer cache is acceptable
 */
export const PRODUCT_REVALIDATE = 86400;

/**
 * Revalidation time for categories (24 hours)
 * Categories rarely change, so longer cache is appropriate
 */
export const CATEGORIES_REVALIDATE = 86400;

/**
 * FakeStoreAPI base URL
 * Reads from environment variable with fallback for safety
 */
export const API_BASE_URL = process.env.API_BASE_URL;

/**
 * Default debounce delay for search input (milliseconds)
 * Prevents excessive API calls while user is typing
 */
export const DEFAULT_DEBOUNCE_MS = 400;

/**
 * Default maximum length for search input
 * Prevents overly long search queries
 */
export const DEFAULT_MAX_SEARCH_LENGTH = 100;
