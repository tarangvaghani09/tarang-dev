export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (configured && configured.trim().length > 0) {
    return configured.trim();
  }

  if (typeof window !== "undefined") {
    if (window.location.port === "5000") {
      return "";
    }
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  return "";
}
