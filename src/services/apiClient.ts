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
    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return Promise.reject(new ApiError("Request timed out. Please try again."));
    }

    if (!error.response) {
      return Promise.reject(new ApiError("Unable to connect to the server."));
    }

    const status = error.response.status;
    const message = status === 404
      ? "The requested resource was not found."
      : status >= 500
        ? "Server error. Please try again later."
        : "Something went wrong. Please try again.";

    if (import.meta.env.DEV) console.error("API error:", error);

    return Promise.reject(new ApiError(message, status));
  },
);

export default apiClient;
