import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

export default function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={({ resetErrorBoundary }) => <ErrorFallback onRetry={resetErrorBoundary} />}
      onError={(error, info) => console.error("React Error Boundary caught an error:", error, info)}
    >
      {children}
    </ErrorBoundary>
  );
}
