"use client";

import { useSearch } from "@/hooks/useSearch";
import { useFilters } from "@/hooks/useFilter";
import { formatLabel } from "@/lib/utils/searchUtils";
import { DEFAULT_MAX_SEARCH_LENGTH } from "@/lib/config";
import {
  LoadingOverlay,
  TextInput,
  Select,
  Button,
  type SelectOption,
} from "./ui";
import styles from "./SearchFilterForm.module.css";

interface SearchFilterFormProps {
  categories: string[];
  baseRoute?: string;
  searchPlaceholder?: string;
  filterLabel?: string;
  emptyFilterLabel?: string;
  maxSearchLength?: number;
}

/**
 * Search and filter form component for product catalog
 *
 * @param props.categories - Available category options
 * @param props.baseRoute - Base route for navigation (default: "/products")
 * @param props.searchPlaceholder - Search input placeholder (default: "Search products...")
 * @param props.filterLabel - Label for category filter (default: "category")
 * @param props.emptyFilterLabel - Empty option label (default: "All Categories")
 * @param props.maxSearchLength - Maximum search input length (default: 100)
 */
export default function SearchFilterForm({
  categories,
  baseRoute = "/products",
  searchPlaceholder = "Search products...",
  filterLabel = "category",
  emptyFilterLabel = "All Categories",
  maxSearchLength = DEFAULT_MAX_SEARCH_LENGTH,
}: SearchFilterFormProps) {
  const search = useSearch({
    baseRoute,
    queryKey: "search",
    maxLength: maxSearchLength,
  });

  const filters = useFilters({
    baseRoute,
    filters: [{ key: "category", allowedValues: categories }],
  });

  const isPending = search.isPending || filters.isPending;
  const hasActiveFilters = search.hasActiveSearch || filters.hasActiveFilters;

  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat,
    label: formatLabel(cat),
  }));

  const handleClearAll = () => {
    // Clear local search state without navigation
    search.clearSearch(true);
    // Clear all filters AND the search param in one navigation
    filters.clearAllFilters([search.queryKey]);
  };

  return (
    <div className={styles.form} role="search">
      <LoadingOverlay isVisible={isPending} spinnerLabel="Loading results" />

      <TextInput
        id="search-input"
        value={search.searchValue}
        onChange={search.setSearchValue}
        placeholder={searchPlaceholder}
        maxLength={maxSearchLength}
        isLoading={isPending}
      />

      <div className={styles.filters}>
        <Select
          id="category-select"
          value={filters.filterValues.category || ""}
          onChange={(value) => filters.setFilter("category", value)}
          options={categoryOptions}
          placeholder={emptyFilterLabel}
          label={`Filter by ${filterLabel}`}
          isLoading={isPending}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearAll}
            isLoading={isPending}
            loadingText="Clearing..."
            ariaLabel="Clear all filters"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
