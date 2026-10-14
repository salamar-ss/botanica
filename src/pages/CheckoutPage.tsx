import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkoutSchema, type CheckoutFormData } from "@/features/checkout/schemas/checkoutSchema";
import { useCartStore } from "@/features/cart/store/useCartStore";
import "./CheckoutPage.scss";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [submitError, setSubmitError] = useState("");
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 75 ? 0 : 5.99;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      notes: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitError("");
    setShowValidationSummary(false);

    try {
      const orderNumber = `BOT-${Date.now().toString().slice(-8)}`;
      const itemCount = items.reduce((count, item) => count + item.quantity, 0);

      clearCart();

      navigate("/order-confirmation", {
        state: {
          orderNumber,
          customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
          total,
          itemCount,
        },
      });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  const onInvalid = () => {
    setSubmitError("");
    setShowValidationSummary(true);
  };

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-page__empty">
          <p className="checkout-page__eyebrow">YOUR ORDER</p>
          <h1>Your cart is empty</h1>
          <p>Add some products before proceeding to checkout.</p>
          <Link className="checkout-page__back-link" to="/">Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page__container">
        <div className="checkout-page__heading">
          <p className="checkout-page__eyebrow">ALMOST YOURS</p>
          <h1 className="checkout-page__title">Checkout</h1>
          <p className="checkout-page__description">Enter your details to complete your demo order.</p>
        </div>

        <div className="checkout-page__layout">
          <form className="checkout-form" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
            {showValidationSummary && (
              <div className="checkout-form__validation-summary" role="alert" aria-live="assertive">
                <strong>Please check your information.</strong>
                <p>Complete all required fields correctly before placing your order.</p>
                <ul>
                  {Object.values(errors).map((error, index) => (
                    error?.message ? <li key={`${error.message}-${index}`}>{error.message}</li> : null
                  ))}
                </ul>
              </div>
            )}

            <section className="checkout-form__section">
              <h2 className="checkout-form__section-title">Contact information</h2>
              <div className="checkout-form__grid">
                <div className="checkout-form__field">
                  <label htmlFor="firstName">First name</label>
                  <input id="firstName" autoComplete="given-name" {...register("firstName")} aria-invalid={Boolean(errors.firstName)} />
                  {errors.firstName && <p className="checkout-form__error">{errors.firstName.message}</p>}
                </div>
                <div className="checkout-form__field">
                  <label htmlFor="lastName">Last name</label>
                  <input id="lastName" autoComplete="family-name" {...register("lastName")} aria-invalid={Boolean(errors.lastName)} />
                  {errors.lastName && <p className="checkout-form__error">{errors.lastName.message}</p>}
                </div>
                <div className="checkout-form__field">
                  <label htmlFor="email">Email address</label>
                  <input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
                  {errors.email && <p className="checkout-form__error">{errors.email.message}</p>}
                </div>
                <div className="checkout-form__field">
                  <label htmlFor="phone">Phone number</label>
                  <input id="phone" type="tel" autoComplete="tel" {...register("phone")} aria-invalid={Boolean(errors.phone)} />
                  {errors.phone && <p className="checkout-form__error">{errors.phone.message}</p>}
                </div>
              </div>
            </section>

            <section className="checkout-form__section">
              <h2 className="checkout-form__section-title">Shipping address</h2>
              <div className="checkout-form__grid">
                <div className="checkout-form__field checkout-form__field--full">
                  <label htmlFor="address">Street address</label>
                  <input id="address" autoComplete="street-address" {...register("address")} aria-invalid={Boolean(errors.address)} />
                  {errors.address && <p className="checkout-form__error">{errors.address.message}</p>}
                </div>
                <div className="checkout-form__field">
                  <label htmlFor="city">City</label>
                  <input id="city" autoComplete="address-level2" {...register("city")} aria-invalid={Boolean(errors.city)} />
                  {errors.city && <p className="checkout-form__error">{errors.city.message}</p>}
                </div>
                <div className="checkout-form__field">
                  <label htmlFor="postalCode">Postal code</label>
                  <input id="postalCode" autoComplete="postal-code" {...register("postalCode")} aria-invalid={Boolean(errors.postalCode)} />
                  {errors.postalCode && <p className="checkout-form__error">{errors.postalCode.message}</p>}
                </div>
                <div className="checkout-form__field checkout-form__field--full">
                  <label htmlFor="country">Country</label>
                  <input id="country" autoComplete="country-name" {...register("country")} aria-invalid={Boolean(errors.country)} />
                  {errors.country && <p className="checkout-form__error">{errors.country.message}</p>}
                </div>
                <div className="checkout-form__field checkout-form__field--full">
                  <label htmlFor="notes">Order notes (optional)</label>
                  <textarea id="notes" rows={3} {...register("notes")} aria-invalid={Boolean(errors.notes)} />
                  {errors.notes && <p className="checkout-form__error">{errors.notes.message}</p>}
                </div>
              </div>
            </section>

            {submitError && <p className="checkout-form__error" role="alert">{submitError}</p>}

            <button className="checkout-form__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place demo order"}
            </button>
            <p className="checkout-form__notice">Demo checkout only. No payment will be collected.</p>
          </form>

          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">Order summary</h2>
            <div className="checkout-summary__items">
              {items.map(({ product, quantity }) => (
                <div className="checkout-summary__item" key={product.id}>
                  <img src={product.thumbnail} alt="" className="checkout-summary__image" />
                  <div className="checkout-summary__product">
                    <span className="checkout-summary__name">{product.title}</span>
                    <span className="checkout-summary__quantity">Qty: {quantity}</span>
                  </div>
                  <span className="checkout-summary__price">${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <p className="checkout-summary__shipping-note">{subtotal >= 75 ? "You've unlocked free shipping." : `Spend $${(75 - subtotal).toFixed(2)} more for free shipping.`}</p>
            <div className="checkout-summary__total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <Link className="checkout-summary__back-link" to="/cart">Return to cart</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}