import { Link, useLocation } from "react-router-dom";
import "./OrderConfirmationPage.scss";
interface OrderConfirmationState {
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  total: number;
  itemCount: number;
}

function isValidOrderState(state: unknown): state is OrderConfirmationState {
  if (typeof state !== "object" || state === null) return false;

  const order = state as Record<string, unknown>;

  if (
    typeof order.orderNumber !== "string" || !order.orderNumber ||
    typeof order.total !== "number" || !Number.isFinite(order.total) ||
    typeof order.itemCount !== "number" || !Number.isInteger(order.itemCount) ||
    order.itemCount < 0
  ) return false;

  if (typeof order.customer !== "object" || order.customer === null) return false;

  const customer = order.customer as Record<string, unknown>;

  return (
    typeof customer.firstName === "string" && !!customer.firstName &&
    typeof customer.lastName === "string" &&
    typeof customer.email === "string" && !!customer.email
  );
}

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = isValidOrderState(location.state) ? location.state : null;

  return (
    <main className="order-confirmation">
      {!order && (
        <div className="order-confirmation__content">
          <p className="order-confirmation__eyebrow">BOTANICA</p>
          <h1 className="order-confirmation__title">No recent order found</h1>
          <p className="order-confirmation__description">Place an order first to see your confirmation details.</p>
          <Link className="order-confirmation__button" to="/">Return to shop</Link>
        </div>
      )}

      {order && (
        <div className="order-confirmation__content">
          <div className="order-confirmation__icon" aria-hidden="true">✓</div>
          <p className="order-confirmation__eyebrow">BOTANICA · ORDER CONFIRMED</p>
          <h1 className="order-confirmation__title">Thank you, {order.customer.firstName}.</h1>
          <p className="order-confirmation__description">
            Your demo order has been completed successfully.
            This is a portfolio demonstration; no real payment or shipment has been created.
          </p>

          <div className="order-confirmation__details">
            <div className="order-confirmation__detail">
              <span>Order reference</span>
              <strong>{order.orderNumber}</strong>
            </div>
            <div className="order-confirmation__detail">
              <span>Confirmation email</span>
              <strong>{order.customer.email}</strong>
            </div>
            <div className="order-confirmation__detail">
              <span>Items</span>
              <strong>{order.itemCount}</strong>
            </div>
            <div className="order-confirmation__detail">
              <span>Order total</span>
              <strong>${order.total.toFixed(2)}</strong>
            </div>
          </div>

          <Link className="order-confirmation__button" to="/">Continue shopping</Link>
        </div>
      )}
    </main>
  );
}
