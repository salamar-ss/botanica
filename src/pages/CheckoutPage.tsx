
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkoutSchema, type CheckoutFormData } from "@/features/checkout/schemas/checkoutSchema";
import FormInput from "@/features/checkout/components/FormInput";
import { selectCartCount, selectCartTotal, useCartStore } from "@/features/cart/store/useCartStore";
import "./CheckoutPage.scss";

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 5.99;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore(selectCartTotal);
  const itemCount = useCartStore(selectCartCount);
  const [submitError, setSubmitError] = useState("");
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>({
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

  return (
    <main className="checkout-page">
      {!items.length && (
        <div className="checkout-page__empty">
          <p className="checkout-page__eyebrow">YOUR ORDER</p>
          <h1>Your cart is empty</h1>
          <p>Add some products before proceeding to checkout.</p>
          <Link className="checkout-page__back-link" to="/">Continue shopping</Link>
        </div>
      )}

      {!!items.length && (
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
                    {Object.entries(errors).map(([field, error]) => (
                      error?.message && <li key={field}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <section className="checkout-form__section">
                <h2 className="checkout-form__section-title">Contact information</h2>
                <div className="checkout-form__grid">
                  <FormInput id="firstName" label="First name" autoComplete="given-name" registration={register("firstName")} error={errors.firstName?.message} />
                  <FormInput id="lastName" label="Last name" autoComplete="family-name" registration={register("lastName")} error={errors.lastName?.message} />
                  <FormInput id="email" label="Email address" type="email" autoComplete="email" registration={register("email")} error={errors.email?.message} />
                  <FormInput id="phone" label="Phone number" type="tel" autoComplete="tel" registration={register("phone")} error={errors.phone?.message} />
                </div>
              </section>

              <section className="checkout-form__section">
                <h2 className="checkout-form__section-title">Shipping address</h2>
                <div className="checkout-form__grid">
                  <FormInput id="address" label="Street address" autoComplete="street-address" wrapperClassName="checkout-form__field--full" registration={register("address")} error={errors.address?.message} />
                  <FormInput id="city" label="City" autoComplete="address-level2" registration={register("city")} error={errors.city?.message} />
                  <FormInput id="postalCode" label="Postal code" autoComplete="postal-code" registration={register("postalCode")} error={errors.postalCode?.message} />
                  <FormInput id="country" label="Country" autoComplete="country-name" wrapperClassName="checkout-form__field--full" registration={register("country")} error={errors.country?.message} />

                  <div className="checkout-form__field checkout-form__field--full">
                    <label htmlFor="notes">Order notes (optional)</label>
                    <textarea id="notes" rows={3} {...register("notes")} aria-invalid={Boolean(errors.notes)} />
                    {errors.notes?.message && <p className="checkout-form__error">{errors.notes.message}</p>}
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
                <span>Items ({itemCount})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="checkout-summary__row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>

              {remainingForFreeShipping > 0 && (
                <p className="checkout-summary__shipping-note">
                  Spend ${remainingForFreeShipping.toFixed(2)} more for free shipping.
                </p>
              )}

              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <p className="checkout-summary__shipping-note">You've unlocked free shipping.</p>
              )}

              <div className="checkout-summary__total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <Link className="checkout-summary__back-link" to="/cart">Return to cart</Link>
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}