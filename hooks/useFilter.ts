// hooks/useFilters.ts

import { useCallback } from "react";
import { useUrlNavigation } from "./useUrlNavigation";

export interface FilterConfig {
  key: string;
  allowedValues: string[];
}

export interface UseFiltersConfig {
  baseRoute: string;
  filters: FilterConfig[];
  preserveParams?: boolean;
}

export interface UseFiltersReturn {
  filterValues: Record<string, string>;
  isPending: boolean;
  hasActiveFilters: boolean;
  setFilter: (key: string, value: string) => void;
  clearFilter: (key: string) => void;
  clearAllFilters: (additionalKeysToRemove?: string[]) => void;
  getAllowedValues: (key: string) => string[];
}

/**
 * Hook for managing multiple filters with immediate URL updates
 *
 * @param config - Filter configuration
 * @param config.baseRoute - Base route for navigation (e.g., "/products")
 * @param config.filters - Array of filter configurations with keys and allowed values
 * @param config.preserveParams - Preserve other URL parameters (default: true)
 *
 * @returns Filter state and control functions
 *
 * @example
 * ```tsx
 * const { filterValues, setFilter, clearAllFilters } = useFilters({
 *   baseRoute: '/products',
 *   filters: [
 *     { key: 'category', allowedValues: ['electronics', 'clothing'] },
 *     { key: 'brand', allowedValues: ['apple', 'samsung'] }
 *   ]
 * });
 * ```
 */
export function useFilters({
  baseRoute,
  filters,
  preserveParams = true,
}: UseFiltersConfig): UseFiltersReturn {
  const { navigate, navigateToBase, isPending, searchParams } =
    useUrlNavigation({
      baseRoute,
      preserveParams,
    });

  // Create lookup map for O(1) filter config access
  const filterConfigMap = filters.reduce((acc, filter) => {
    acc[filter.key] = filter;
    return acc;
  }, {} as Record<string, FilterConfig>);

  /**
   * Extract and validate filter values from URL
   * Only includes values that exist in allowedValues
   */
  const filterValues = filters.reduce((acc, filter) => {
    const urlValue = searchParams.get(filter.key) || "";
    if (urlValue && filter.allowedValues.includes(urlValue)) {
      acc[filter.key] = urlValue;
    }
    return acc;
  }, {} as Record<string, string>);

  const hasActiveFilters = Object.keys(filterValues).length > 0;

  const setFilter = useCallback(
    (key: string, value: string) => {
      const filterConfig = filterConfigMap[key];

      if (!filterConfig) {
        console.warn(`Filter key "${key}" is not configured`);
        return;
      }

      // Validate value against allowed values
      if (value && !filterConfig.allowedValues.includes(value)) {
        console.warn(
          `Value "${value}" not allowed for filter "${key}". ` +
            `Allowed: ${filterConfig.allowedValues.join(", ")}`
        );
        return;
      }

      // Set or remove filter based on value
      navigate(value ? { [key]: value } : {}, value ? [] : [key]);
    },
    [filterConfigMap, navigate]
  );

  const clearFilter = useCallback(
    (key: string) => {
      navigate({}, [key]);
    },
    [navigate]
  );

  const clearAllFilters = useCallback(
    (additionalKeysToRemove: string[] = []) => {
      const filterKeys = filters.map((f) => f.key);
      const allKeysToRemove = [...filterKeys, ...additionalKeysToRemove];
      // Preserve parameters not in the removal list
      const preserveKeys = Array.from(searchParams.keys()).filter(
        (key) => !allKeysToRemove.includes(key)
      );
      navigateToBase(preserveKeys);
    },
    [filters, navigateToBase, searchParams]
  );

  const getAllowedValues = useCallback(
    (key: string): string[] => {
      return filterConfigMap[key]?.allowedValues || [];
    },
    [filterConfigMap]
  );

  return {
    filterValues,
    isPending,
    hasActiveFilters,
    setFilter,
    clearFilter,
    clearAllFilters,
    getAllowedValues,
  };
}
