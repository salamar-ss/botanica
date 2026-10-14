import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/features/products/api/productsApi";

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => getProductById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}