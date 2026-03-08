export function getApiBaseUrl(): string {
  const configuredBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (configuredBase && configuredBase.trim().length > 0) {
    return configuredBase.trim();
  }

  const configuredLegacy = import.meta.env.VITE_API_URL as string | undefined;
  if (configuredLegacy && configuredLegacy.trim().length > 0) {
    return configuredLegacy.trim();
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
