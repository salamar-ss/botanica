import axios, { type AxiosError } from "axios";

export class ApiError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return Promise.reject(
        new ApiError("The request timed out. Please try again."),
      );
    }

    if (!error.response) {
      return Promise.reject(
        new ApiError(
          "Unable to connect to the server. Check your internet connection and try again.",
        ),
      );
    }

    const status = error.response.status;

    const messages: Record<number, string> = {
      400: "Invalid request. Please check your input.",
      401: "Please sign in to continue.",
      403: "You do not have permission to perform this action.",
      404: "The requested resource was not found.",
      429: "Too many requests. Please try again later.",
      500: "A server error occurred. Please try again later.",
      502: "The server is temporarily unavailable.",
      503: "The service is temporarily unavailable.",
      504: "The server took too long to respond.",
    };

    const message =
      messages[status] ??
      (status >= 500
        ? "A server error occurred. Please try again later."
        : "Something went wrong. Please try again.");

    return Promise.reject(new ApiError(message, status));
  },
);

export default apiClient;