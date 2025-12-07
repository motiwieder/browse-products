
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * Configuration options for URL navigation
 */
export interface UrlNavigationConfig {
  /** Base route for navigation (e.g., "/products") */
  baseRoute: string;

  /** Whether to preserve existing query parameters when updating (default: true) */
  preserveParams?: boolean;
}

/**
 * Shared hook for managing URL query parameter navigation
 *
 * @description
 * Centralizes URL manipulation logic to avoid duplication across multiple hooks.
 * Provides methods for updating query parameters and navigating with transitions.
 *
 * @example
 * ```tsx
 * const { navigate, isPending } = useUrlNavigation({
 *   baseRoute: '/products'
 * });
 *
 * // Update single parameter
 * navigate({ search: 'laptop' });
 *
 * // Update multiple parameters
 * navigate({ search: 'laptop', category: 'electronics' });
 *
 * // Remove parameters
 * navigate({}, ['search', 'category']);
 * ```
 *
 * @param config - Configuration options
 * @returns Navigation methods and state
 */
export function useUrlNavigation({
  baseRoute,
  preserveParams = true,
}: UrlNavigationConfig) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /**
   * Navigate to URL with updated query parameters
   *
   * @param updates - Key-value pairs to add/update in URL
   * @param keysToDelete - Parameter keys to remove from URL
   */
  const navigate = useCallback(
    (updates: Record<string, string> = {}, keysToDelete: string[] = []) => {
      const params = preserveParams
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();

      keysToDelete.forEach((key) => params.delete(key));

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const url = params.toString() ? `${baseRoute}?${params}` : baseRoute;

      startTransition(() => {
        router.push(url);
      });
    },
    [router, baseRoute, preserveParams, searchParams]
  );

  /**
   * Navigate to base route, optionally preserving specific parameters
   *
   * @param keysToPreserve - Optional array of parameter keys to keep
   */
  const navigateToBase = useCallback(
    (keysToPreserve: string[] = []) => {
      if (keysToPreserve.length === 0 || !preserveParams) {
        startTransition(() => {
          router.push(baseRoute);
        });
        return;
      }

      const params = new URLSearchParams();
      keysToPreserve.forEach((key) => {
        const value = searchParams.get(key);
        if (value) {
          params.set(key, value);
        }
      });

      const url = params.toString() ? `${baseRoute}?${params}` : baseRoute;

      startTransition(() => {
        router.push(url);
      });
    },
    [router, baseRoute, preserveParams, searchParams]
  );

  return {
    navigate,
    navigateToBase,
    isPending,
    searchParams,
  };
}
