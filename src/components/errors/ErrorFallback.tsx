import "./ErrorFallback.scss";

type ErrorFallbackProps = {
  onRetry: () => void;
};

export default function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <main className="error-fallback">
      <div className="error-fallback__content">
        <span className="error-fallback__icon" aria-hidden="true">
          !
        </span>

        <h1 className="error-fallback__title">
          Something went wrong
        </h1>

        <p className="error-fallback__description">
          An unexpected error occurred. Please try again.
        </p>

        <button className="error-fallback__button" type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    </main>
  );
}