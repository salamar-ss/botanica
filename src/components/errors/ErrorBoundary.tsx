import { Component } from "react";
import ErrorFallback from "./ErrorFallback";

export default class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  handleRetry = () => window.location.reload();

  render() {
    return this.state.hasError ? <ErrorFallback onRetry={this.handleRetry} /> : this.props.children;
  }
}
