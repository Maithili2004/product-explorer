import useSWR from 'swr';
import { apiClient } from '@/utils/api-client';
import type { Navigation, Category, Product, PaginatedResponse, Review } from '@/types';

export function useNavigations() {
  const { data, error, isLoading, mutate } = useSWR<Navigation[]>(
    '/navigations',
    () => apiClient.getNavigations(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    },
  );

  return { navigations: data, isLoading, error, mutate };
}

export function useNavigation(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Navigation>(
    id ? `/navigation/${id}` : null,
    () => apiClient.getNavigation(id),
  );

  return { navigation: data, isLoading, error, mutate };
}

export function useCategories(navigationId?: string) {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    navigationId ? `/categories/${navigationId}` : '/categories',
    () => apiClient.getCategories(navigationId),
  );

  return { categories: data, isLoading, error, mutate };
}

export function useCategory(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Category>(
    id ? `/category/${id}` : null,
    () => apiClient.getCategory(id),
  );

  return { category: data, isLoading, error, mutate };
}

export function useSubcategories(parentId: string) {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    parentId ? `/subcategories/${parentId}` : null,
    () => apiClient.getSubcategories(parentId),
  );

  return { subcategories: data, isLoading, error, mutate };
}

export function useProducts(categoryId?: string, limit: number = 20, offset: number = 0) {
  const key = `/products${categoryId ? `?categoryId=${categoryId}` : ''}?limit=${limit}&offset=${offset}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    key,
    () => apiClient.getProducts(categoryId, limit, offset),
  );

  return { products: data, isLoading, error, mutate };
}

export function useProduct(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    id ? `/product/${id}` : null,
    () => apiClient.getProduct(id),
  );

  return { product: data, isLoading, error, mutate };
}

export function useProductReviews(productId: string, limit: number = 10, offset: number = 0) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Review>>(
    productId ? `/product/${productId}/reviews?limit=${limit}&offset=${offset}` : null,
    () => apiClient.getProductReviews(productId, limit, offset),
  );

  return { reviews: data, isLoading, error, mutate };
}

export function useRelatedProducts(productId: string, limit: number = 5) {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    productId ? `/product/${productId}/related?limit=${limit}` : null,
    () => apiClient.getRelatedProducts(productId, limit),
  );

  return { related: data, isLoading, error, mutate };
}

export function useAllProducts(limit: number = 12, offset: number = 0) {
  const key = `/products?limit=${limit}&offset=${offset}`;

  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    key,
    () => apiClient.getProducts(undefined, limit, offset).then((response) => {
      if (Array.isArray(response)) {
        return response;
      }
      return response?.items || [];
    }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    },
  );

  return { products: data, isLoading, error, mutate };
}
