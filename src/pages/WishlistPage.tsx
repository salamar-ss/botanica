import { Link } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import "./WishlistPage.scss";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  return (
    <main className="wishlist-page">
      <div className="wishlist-page__container">
        <div className="wishlist-page__heading">
          <p className="wishlist-page__eyebrow">YOUR PERSONAL COLLECTION</p>
          <h1 className="wishlist-page__title">Your wishlist</h1>
          <p className="wishlist-page__description">{items.length} {items.length === 1 ? "product" : "products"} saved for later.</p>
        </div>

        {!items.length ? (
          <div className="wishlist-page__empty">
            <span className="wishlist-page__empty-icon" aria-hidden="true">♡</span>
            <h2>Your wishlist is empty</h2>
            <p>Save the products you love and find them here whenever you need them.</p>
            <Link className="wishlist-page__shop-link" to="/#products">Explore the collection</Link>
          </div>
        ) : (
          <>
            <div className="wishlist-page__toolbar">
              <span>{items.length} saved {items.length === 1 ? "item" : "items"}</span>
              <button className="wishlist-page__clear" type="button" onClick={clearWishlist}>Clear wishlist</button>
            </div>

            <div className="wishlist-page__grid">
              {items.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
