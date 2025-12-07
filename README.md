# Product Catalog - Next.js Full-Stack Assessment

A performance-optimized, SEO-friendly product catalog built with Next.js App Router, demonstrating various rendering strategies for optimal user experience.

## Features

- **Home Page**: Static "HELLO WORLD" page with navigation
- **Product Catalog**: Browse all products with search and category filtering
- **Single Product Pages**: Detailed product information with SEO metadata
- **Search & Filter**: Dynamic filtering using URL search parameters
- **Error Handling**: Loading states, error boundaries, and 404 pages
- **Clean Code**: Modular TypeScript components with clear documentation
- **Responsive Design**: Mobile-first design that works on all screen sizes

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/motiwieder/browse-products.git
   cd browse-products
   ```

2. Install dependencies:

   ```bash
   npm install
   ```
3. Rename `.env.local.example` to `.env.local` and add your actual API key or credentials.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
browse-products/
├── app/
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── not-found.tsx             # 404 page
│   └── products/
│       ├── page.tsx              # Product catalog
│       ├── loading.tsx           # Loading skeleton
│       ├── error.tsx             # Error boundary
│       └── [id]/
│           ├── page.tsx          # Single product page
│           └── not-found.tsx     # Product not found page
├── components/
│   ├── Header.tsx                # Navigation header
│   ├── ProductCard.tsx           # Product grid card
│   ├── ProductDetails.tsx        # Single product display
│   ├── SearchFilterForm.tsx      # Search/filter client component
│   ├── StarRating.tsx            # Star rating display
│   └── ui/
│       ├── index.ts              # UI components barrel export
│       ├── Button.tsx            # Reusable button component
│       ├── TextInput.tsx         # Text input component
│       ├── Select.tsx            # Select dropdown component
│       └── LoadingOverlay.tsx    # Loading overlay component
├── hooks/
│   ├── useUrlNavigation.ts       # URL query parameter navigation
│   ├── useSearch.ts              # Debounced search with URL sync
│   └── useFilter.ts              # Multi-filter management
└── lib/
    ├── api.ts                    # API fetch utilities
    ├── config.ts                 # Revalidation configuration
    ├── types.ts                  # TypeScript interfaces
    └── utils/
        └── searchUtils.ts        # Search utility functions
```


## Rendering Strategy Justification

This project implements different rendering strategies based on the specific requirements of each page, balancing performance, SEO, and dynamic functionality.

### Home Page (`/`)

**Strategy**: Static Site Generation (SSG)

The home page contains only static content ("HELLO WORLD" and navigation links). It is pre-rendered at build time with no revalidation needed, providing instant load times.

### Product Catalog (`/products`)

**Strategy**: SSG with Incremental Static Regeneration (ISR) + Dynamic Server Rendering

**Configuration**: `revalidate = 3600` (1 hour)

This page uses a hybrid approach:

1. **Without search parameters**: The page is statically generated at build time and cached. It revalidates every hour to ensure product data stays relatively fresh while maintaining excellent performance. This is ideal for SEO as search engines receive pre-rendered HTML.

2. **With search parameters** (`?search=...&category=...`): When users apply filters, Next.js automatically switches to Dynamic Server Rendering. Each unique combination of search parameters triggers a fresh server render, ensuring users always see accurate filtered results.

**Why this approach?**

- SEO: Static pages are fully crawlable by search engines
- Performance: Cached pages load instantly for most users
- Freshness: Hourly revalidation keeps product data current
- Flexibility: Dynamic rendering for filtered views ensures accuracy

### Single Product Pages (`/products/[id]`)

**Strategy**: SSG with ISR + generateStaticParams

**Configuration**: `revalidate = 86400` (24 hours)

Individual product pages are pre-rendered at build time using `generateStaticParams()`, which fetches all product IDs and generates static pages for each. Benefits:

1. **Build-time generation**: All 20 product pages are pre-built, eliminating cold starts
2. **SEO optimization**: Each page has dynamic metadata (title, description) for search engines
3. **Daily revalidation**: Product details change infrequently, so 24-hour cache is appropriate
4. **Fallback handling**: If a product doesn't exist, the `notFound()` function triggers the 404 page

**Why this approach?**

- Maximum performance: Pre-built pages load instantly
- Excellent SEO: Unique meta tags per product improve search visibility
- Cost-effective: Reduces server load by serving cached pages
- Fresh enough: Daily updates catch any product changes

### Search/Filter Functionality

**Strategy**: Client-side URL updates + Server-side filtering

The `SearchFilterForm` is a Client Component that:

1. Captures user input (search text, category selection)
2. Updates the URL search parameters using `useRouter`
3. Triggers a server-side re-render of the catalog page

This approach ensures:

- **Shareable URLs**: Filter states are preserved in the URL
- **SEO-friendly**: Filtered pages can be indexed if desired
- **Fast filtering**: Server-side filtering is efficient and secure
- **No client-side data fetching**: All data comes from the server

## Configuration

Revalidation times and shared constants are centralized in `lib/config.ts` for easy maintenance:

```typescript
export const CATALOG_REVALIDATE = 3600;        // 1 hour
export const PRODUCT_REVALIDATE = 86400;       // 24 hours
export const DEFAULT_DEBOUNCE_MS = 400;        // Search debounce delay
export const DEFAULT_MAX_SEARCH_LENGTH = 100;  // Max search input length
```


## Custom Hooks

### `useUrlNavigation`

Base hook for URL query parameter manipulation with React transitions.

```tsx
const { navigate, navigateToBase, isPending, searchParams } = useUrlNavigation({
  baseRoute: "/products",
  preserveParams: true,
});

// Update parameters
navigate({ search: "laptop", category: "electronics" });

// Remove parameters
navigate({}, ["search", "category"]);

// Navigate to base route
navigateToBase();
```

### `useSearch`

Debounced search input with automatic URL synchronization.

```tsx
const { searchValue, setSearchValue, clearSearch, isPending } = useSearch({
  baseRoute: "/products",
  queryKey: "search",
  debounceMs: 400,
  maxLength: 100,
});
```

### `useFilters`

Multi-filter management with validation against allowed values.

```tsx
const { filterValues, setFilter, clearAllFilters, isPending } = useFilters({
  baseRoute: "/products",
  filters: [
    { key: "category", allowedValues: ["electronics", "clothing"] },
    { key: "brand", allowedValues: ["apple", "samsung"] },
  ],
});
```

## API

- `GET /products` - All products
- `GET /products/:id` - Single product
- `GET /products/categories` - All categories
- `GET /products/category/:name` - Products by category

## Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **CSS Modules** - Scoped, maintainable styling
- **React Server Components** - Optimal performance

## Rendering Strategy Summary

| Page                     | Strategy    | Revalidation | Use Case                 |
| ------------------------ | ----------- | ------------ | ------------------------ |
| Home `/`                 | SSG         | None         | Static content           |
| Catalog `/products`      | SSG + ISR   | 3600s (1h)   | SEO + fresh data         |
| Catalog with filters     | Dynamic SSR | None         | Real-time results        |
| Product `/products/[id]` | SSG + ISR   | 86400s (24h) | Pre-built, daily refresh |
