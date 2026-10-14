import { useCategories } from "@/features/categories/hooks/useCategories";
import Loading from "@/components/ui/Loading";
import "./CategoryList.scss";

const categoryLabels: Record<string, string> = {
  beauty: "Beauty",
  "skin-care": "Skin Care",
  fragrances: "Fragrances",
};

interface CategoryListProps {
  onSelectCategory?: (category: string) => void;
}

export default function CategoryList({ onSelectCategory }: CategoryListProps) {
  const { data: categories, isLoading, isError, error } = useCategories();
  const availableCategories = (categories ?? []).filter((category) => category in categoryLabels);

  return (
    <>
      {isLoading && <Loading message="Loading categories..." />}

      {isError && (
        <p className="category-list__error" role="alert">
          {error instanceof Error ? error.message : "Could not load categories."}
        </p>
      )}

      {!isLoading && !isError && !availableCategories.length && (
        <p className="category-list__empty">No categories available.</p>
      )}

      {!isLoading && !isError && !!availableCategories.length && (
        <div className="category-list">
          {availableCategories.map((category, index) => (
            <button className="category-list__item" key={category} type="button" onClick={() => onSelectCategory?.(category)}>
              <span className="category-list__number">{String(index + 1).padStart(2, "0")}</span>
              <span className="category-list__title">{categoryLabels[category]}</span>
              <span className="category-list__arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}