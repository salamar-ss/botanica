import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { selectCartTotal, selectCartCount, useCartStore } from "@/features/cart/store/useCartStore";
import { selectWishlistCount, useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import "./Header.scss";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore(selectCartTotal);
  const cartCount = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore(selectWishlistCount);

  useEffect(() => { setIsCartOpen(false); }, [location.pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) setIsCartOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsCartOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__container">
        <Link className="header__logo" to="/" aria-label="Botanica home">botanica<span className="header__logo-accent">.</span></Link>

        <nav className="header__nav" aria-label="Main navigation">
          <Link className="header__link" to="/#categories">Categories</Link>
          <Link className="header__link" to="/#products">Shop</Link>
          <Link className="header__link" to="/#about">Our philosophy</Link>
        </nav>

        <div className="header__actions">
          <Link className="header__wishlist" to="/wishlist" aria-label={`Wishlist, ${wishlistCount} products`}>
            <span aria-hidden="true">{wishlistCount > 0 ? "♥" : "♡"}</span>
            <span>Wishlist</span>
            <span className="header__wishlist-count">{wishlistCount}</span>
          </Link>

          <div className="header__cart-wrapper" ref={cartDropdownRef}>
            <button className="header__cart" type="button" aria-expanded={isCartOpen} aria-controls="header-cart-dropdown" aria-label={`Shopping cart, ${cartCount} items`} onClick={() => setIsCartOpen((open) => !open)}>
              <span>Cart</span><span className="header__cart-count">{cartCount}</span><span className="header__cart-chevron" aria-hidden="true">{isCartOpen ? "⌃" : "⌄"}</span>
            </button>

            {isCartOpen && (
              <div className="header__cart-dropdown" id="header-cart-dropdown">
                <div className="header__cart-heading">
                  <h2>Your cart</h2>
                  <span>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
                </div>

                {!items.length ? (
                  <div className="header__cart-empty">
                    <p>Your cart is empty.</p>
                    <Link to="/#products" onClick={() => setIsCartOpen(false)}>Discover our collection</Link>
                  </div>
                ) : (
                  <>
                    <div className="header__cart-items">
                      {items.map(({ product, quantity }) => (
                        <div className="header__cart-item" key={product.id}>
                          <Link className="header__cart-image-link" to={`/products/${product.id}`}>
                            <img className="header__cart-image" src={product.thumbnail} alt={product.title} />
                          </Link>

                          <div className="header__cart-product">
                            <Link className="header__cart-product-title" to={`/products/${product.id}`}>{product.title}</Link>
                            <span className="header__cart-quantity">Qty: {quantity}</span>
                            <span className="header__cart-price">${(product.price * quantity).toFixed(2)}</span>
                          </div>

                          <button className="header__cart-remove" type="button" aria-label={`Remove ${product.title} from cart`} onClick={() => removeItem(product.id)}>×</button>
                        </div>
                      ))}
                    </div>

                    <div className="header__cart-subtotal">
                      <span>Subtotal</span>
                      <strong>${subtotal.toFixed(2)}</strong>
                    </div>

                    <p className="header__cart-note">Shipping is calculated at checkout.</p>

                    <Link className="header__cart-view" to="/cart">View cart</Link>
                    <Link className="header__cart-checkout" to="/checkout">Proceed to checkout</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
