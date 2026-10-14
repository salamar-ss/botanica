import { apiClient } from "@/services/apiClient";

export async function getCategories(): Promise<string[]> {
  const response = await apiClient.get<string[]>(
    "/products/category-list",
  );

  return response.data;
}