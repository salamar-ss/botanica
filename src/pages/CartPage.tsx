import { Link } from "react-router-dom";
import { selectCartTotal, useCartStore } from "@/features/cart/store/useCartStore";
import "./CartPage.scss";

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 5.99;

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartStore(selectCartTotal);

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <main className="cart-page">
      <p className="cart-page__eyebrow">YOUR SELECTION</p>
      <h1 className="cart-page__title">Shopping cart</h1>

      {!items.length && (
        <div className="cart-page__empty">
          <p>Your cart is empty.</p>
          <Link to="/">Discover our collection</Link>
        </div>
      )}

      {!!items.length && (
        <div className="cart-page__layout">
          <div className="cart-page__items">
            {items.map(({ product, quantity }) => (
              <article className="cart-page__item" key={product.id}>
                <Link className="cart-page__image-link" to={`/products/${product.id}`}>
                  <img className="cart-page__image" src={product.thumbnail} alt={product.title} loading="lazy" />
                </Link>

                <div className="cart-page__item-info">
                  <Link className="cart-page__item-title" to={`/products/${product.id}`}>{product.title}</Link>
                  <p className="cart-page__item-price">${product.price.toFixed(2)}</p>

                  <div className="cart-page__quantity" aria-label={`Quantity for ${product.title}`}>
                    <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} disabled={quantity <= 1} aria-label={`Decrease quantity of ${product.title}`}>−</button>
                    <span aria-live="polite">{quantity}</span>
                    <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock} aria-label={`Increase quantity of ${product.title}`}>+</button>
                  </div>

                  <button className="cart-page__remove" type="button" onClick={() => removeItem(product.id)} aria-label={`Remove ${product.title} from cart`}>Remove</button>
                </div>

                <p className="cart-page__line-total">${(product.price * quantity).toFixed(2)}</p>
              </article>
            ))}
          </div>

          <aside className="cart-page__summary">
            <h2>Order summary</h2>
            <div className="cart-page__summary-row"><span>Items ({itemCount})</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="cart-page__summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>

            {remainingForFreeShipping > 0 && <p className="cart-page__shipping-note">Spend ${remainingForFreeShipping.toFixed(2)} more for free shipping.</p>}
            {subtotal >= FREE_SHIPPING_THRESHOLD && <p className="cart-page__shipping-note">You've unlocked free shipping!</p>}

            <div className="cart-page__summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <Link className="cart-page__checkout-link" to="/checkout">Proceed to checkout</Link>
            <Link className="cart-page__continue" to="/">Continue shopping</Link>
          </aside>
        </div>
      )}
    </main>
  );
}