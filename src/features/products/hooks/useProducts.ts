import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/api/productsApi";

export function useProducts(category: string, limit = 8) {
  return useQuery({
    queryKey: ["products", category, limit],
    queryFn: () => getProducts(category, limit),
    enabled: Boolean(category),
    retry: 1,
  });
}