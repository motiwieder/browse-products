import { useState, useCallback, useRef, useEffect } from "react";
import { useUrlNavigation } from "./useUrlNavigation";
import { DEFAULT_DEBOUNCE_MS, DEFAULT_MAX_SEARCH_LENGTH } from "@/lib/config";

export interface UseSearchConfig {
  baseRoute: string;
  queryKey?: string;
  debounceMs?: number;
  maxLength?: number;
  preserveParams?: boolean;
}

export interface UseSearchReturn {
  searchValue: string;
  isPending: boolean;
  hasActiveSearch: boolean;
  setSearchValue: (value: string) => void;
  clearSearch: (skipNavigation?: boolean) => void;
  queryKey: string;
}

/**
 * Hook for managing search with debounced URL updates
 *
 * @param config - Search configuration
 * @param config.baseRoute - Base route for navigation (e.g., "/products")
 * @param config.queryKey - URL query parameter key (default: "search")
 * @param config.debounceMs - Debounce delay in milliseconds (default: 400)
 * @param config.maxLength - Maximum search term length (default: 100)
 * @param config.preserveParams - Preserve other URL parameters (default: true)
 *
 * @returns Search state and control functions
 *
 * @example
 * ```tsx
 * const { searchValue, setSearchValue, isPending } = useSearch({
 *   baseRoute: '/products',
 *   debounceMs: 400
 * });
 * ```
 */
export function useSearch({
  baseRoute,
  queryKey = "search",
  debounceMs = DEFAULT_DEBOUNCE_MS,
  maxLength = DEFAULT_MAX_SEARCH_LENGTH,
  preserveParams = true,
}: UseSearchConfig): UseSearchReturn {
  const { navigate, isPending, searchParams } = useUrlNavigation({
    baseRoute,
    preserveParams,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const urlSearch = searchParams.get(queryKey) || "";
  const [searchValue, setSearchValue] = useState(urlSearch);

  // Sync local state when URL changes (browser back/forward)
  useEffect(() => {
    setSearchValue(urlSearch);
  }, [urlSearch]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /**
   * Debounced navigation - waits for user to stop typing
   */
  const debouncedNavigate = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const trimmed = value.trim();

        if (trimmed && trimmed.length <= maxLength) {
          navigate({ [queryKey]: trimmed });
        } else {
          navigate({}, [queryKey]);
        }
      }, debounceMs);
    },
    [navigate, queryKey, maxLength, debounceMs]
  );

  const handleSetSearchValue = useCallback(
    (value: string) => {
      setSearchValue(value);
      debouncedNavigate(value);
    },
    [debouncedNavigate]
  );

  const clearSearch = useCallback(
    (skipNavigation = false) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchValue("");
      if (!skipNavigation) {
        navigate({}, [queryKey]);
      }
    },
    [navigate, queryKey]
  );

  return {
    searchValue,
    isPending,
    hasActiveSearch: Boolean(searchValue.trim()),
    setSearchValue: handleSetSearchValue,
    clearSearch,
    queryKey,
  };
}
