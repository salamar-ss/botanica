import { useMemo } from "react";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { ProductSortOption } from "@/features/products/components/ProductFilters";
import ProductCard from "@/components/ui/ProductCard";
import Loading from "@/components/ui/Loading";
import "./ProductGrid.scss";

interface ProductGridProps {
  category: string;
  search: string;
  maxPrice: string;
  sortBy: ProductSortOption;
  limit?: number;
}

export default function ProductGrid({
  category,
  search,
  maxPrice,
  sortBy,
  limit = 100,
}: ProductGridProps) {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProducts(category, limit);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const priceLimit = maxPrice.trim() === "" ? null : Number(maxPrice);

    const result = (products ?? []).filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(normalizedSearch);
      const matchesPrice =
        priceLimit === null ||
        (Number.isFinite(priceLimit) && product.price <= priceLimit);

      return matchesSearch && matchesPrice;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, search, maxPrice, sortBy]);

  const handleRetry = () => {
    void refetch();
  };

  if (isLoading) {
    return <Loading message="Loading products..." />;
  }

  if (isError) {
    return (
      <div className="product-grid__error" role="alert">
        <h3>Unable to load products</h3>
        <p>
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading products. Please try again."}
        </p>
        <button
          className="product-grid__retry"
          type="button"
          onClick={handleRetry}
          disabled={isFetching}
        >
          {isFetching ? "Retrying..." : "Try again"}
        </button>
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <div className="product-grid__empty">
        <p>No products found.</p>
        <p>Try changing your search or clearing the filters.</p>
      </div>
    );
  }

  return (
    <>
      <p className="product-grid__count">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "product" : "products"} found
      </p>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}