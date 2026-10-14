import { Link } from "react-router-dom";
import type { Product } from "@/features/products/types";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import Button from "@/components/ui/Button";
import "./ProductCard.scss";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartQuantity = useCartStore((state) => state.items.find((item) => item.product.id === product.id)?.quantity ?? 0);
  const isFavorite = useWishlistStore((state) => state.items.some((item) => item.id === product.id));
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isOutOfStock = product.stock <= cartQuantity;

  const handleAddToCart = () => {
    if (!isOutOfStock) addItem(product);
  };

  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        <Link className="product-card__image-link" to={`/products/${product.id}`} aria-label={`View ${product.title}`}>
          <img className="product-card__image" src={product.thumbnail} alt={product.title} loading="lazy" />
        </Link>
        <span className="product-card__category">{product.category.replaceAll("-", " ")}</span>
        <button className={`product-card__wishlist ${isFavorite ? "product-card__wishlist--active" : ""}`} type="button" aria-label={isFavorite ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`} aria-pressed={isFavorite} onClick={() => toggleItem(product)}>
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <Link className="product-card__link" to={`/products/${product.id}`} aria-label={`View details for ${product.title}`}>
        <div className="product-card__content">
          <h3 className="product-card__title">{product.title}</h3>
          <p className="product-card__description">{product.description}</p>
          <div className="product-card__footer">
            <span className="product-card__price">${product.price.toFixed(2)}</span>
            <span className="product-card__rating" aria-label={`Rating: ${product.rating} out of 5`}>★ {product.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>

      <div className="product-card__actions">
        <Button className="product-card__add-button" onClick={handleAddToCart} disabled={isOutOfStock} aria-label={`Add ${product.title} to cart`}>
          {isOutOfStock ? "Out of stock" : cartQuantity > 0 ? `Add another (${cartQuantity})` : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}
