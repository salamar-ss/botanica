import { useState } from "react";
import Button from "@/components/ui/Button";
import CategoryList from "@/features/categories/components/CategoryList";
import ProductFilters, { type ProductSortOption } from "@/features/products/components/ProductFilters";
import ProductGrid from "@/features/products/components/ProductGrid";
import "./HomePage.scss";

const categories = [
  { value: "beauty", label: "Beauty", title: "Beauty essentials" },
  { value: "skin-care", label: "Skin Care", title: "Skin care rituals" },
  { value: "fragrances", label: "Fragrances", title: "Fragrances" },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("beauty");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<ProductSortOption>("default");

  const categoryTitle = categories.find((category) => category.value === selectedCategory)?.title ?? "Our selection";

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    scrollToProducts();
  };

  const resetFilters = () => {
    setSearch("");
    setMaxPrice("");
    setSortBy("default");
  };

  return (
    <div className="home-page">
      <main>
        <section className="home-page__hero">
          <div className="home-page__hero-content">
            <p className="home-page__eyebrow">BEAUTY, INSPIRED BY NATURE</p>
            <h1 className="home-page__hero-title">A little closer<br />to nature.</h1>
            <p className="home-page__hero-description">Discover thoughtful beauty essentials for your everyday rituals.</p>
            <Button onClick={scrollToProducts}>Explore the collection</Button>
          </div>

          <div className="home-page__hero-image-wrapper">
            <img className="home-page__hero-image" src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=85" alt="Natural skincare products arranged in warm sunlight" />
          </div>
        </section>

        <section className="home-page__section" id="categories">
          <div className="home-page__section-heading">
            <p className="home-page__eyebrow">FIND YOUR RITUAL</p>
            <h2 className="home-page__section-title">Shop by category</h2>
          </div>

          <CategoryList onSelectCategory={handleCategorySelect} />
        </section>

        <section className="home-page__section" id="products">
          <div className="home-page__section-heading home-page__section-heading--products">
            <div>
              <p className="home-page__eyebrow">SELECTED FOR YOU</p>
              <h2 className="home-page__section-title">{categoryTitle}</h2>
            </div>

            <div className="home-page__category-tabs">
              {categories.map((category) => (
                <button className={`home-page__category-tab ${selectedCategory === category.value ? "home-page__category-tab--active" : ""}`} key={category.value} type="button" aria-pressed={selectedCategory === category.value} onClick={() => setSelectedCategory(category.value)}>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <ProductFilters search={search} onSearchChange={setSearch} maxPrice={maxPrice} onMaxPriceChange={setMaxPrice} sortBy={sortBy} onSortChange={setSortBy} onReset={resetFilters} />
          <ProductGrid category={selectedCategory} search={search} maxPrice={maxPrice} sortBy={sortBy} limit={100} />
        </section>

        <section className="home-page__about" id="about">
          <div className="home-page__about-content">
            <p className="home-page__eyebrow">OUR PHILOSOPHY</p>
            <h2 className="home-page__about-title">Less, but more meaningful.</h2>
            <p className="home-page__about-description">We believe that everyday beauty can be simple, intentional and inspired by the natural world. Discover products that make space for mindful moments in your routine.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
