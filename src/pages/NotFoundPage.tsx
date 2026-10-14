import { Link } from "react-router-dom";
import "./NotFoundPage.scss";

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <div className="not-found__content">
        <span className="not-found__code">404</span>
        <h1 className="not-found__title">Oops! Page not found.</h1>
        <p className="not-found__description">
          The page you are looking for doesn't exist or may have been moved.
        </p>
        <Link className="not-found__link" to="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}