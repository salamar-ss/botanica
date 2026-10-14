import { apiClient } from "@/services/apiClient";
import type { Product, ProductsResponse } from "@/features/products/types";

export async function getProducts(category: string, limit = 100): Promise<Product[]> {
  const endpoint = category ? `/products/category/${encodeURIComponent(category)}` : "/products";
  const response = await apiClient.get<ProductsResponse>(endpoint, { params: { limit } });
  return response.data.products;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}