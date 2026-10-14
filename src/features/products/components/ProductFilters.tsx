import "./ProductFilters.scss";

export type ProductSortOption = "default" | "price-asc" | "price-desc";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  sortBy: ProductSortOption;
  onSortChange: (value: ProductSortOption) => void;
  onReset: () => void;
}

export default function ProductFilters({ search, onSearchChange, maxPrice, onMaxPriceChange, sortBy, onSortChange, onReset }: ProductFiltersProps) {
  return (
    <div className="product-filters">
      <label className="product-filters__field">
        <span className="product-filters__label">Search products</span>
        <input className="product-filters__input" type="search" placeholder="Search by name..." value={search} onChange={(event) => onSearchChange(event.target.value)} />
      </label>

      <label className="product-filters__field">
        <span className="product-filters__label">Maximum price ($)</span>
        <input className="product-filters__input" type="number" min="0" placeholder="Any price" value={maxPrice} onChange={(event) => onMaxPriceChange(event.target.value)} />
      </label>

      <label className="product-filters__field">
        <span className="product-filters__label">Sort by</span>
        <select className="product-filters__select" value={sortBy} onChange={(event) => onSortChange(event.target.value as ProductSortOption)}>
          <option value="default">Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>

      <button className="product-filters__reset" type="button" onClick={onReset}>Clear filters</button>
    </div>
  );
}