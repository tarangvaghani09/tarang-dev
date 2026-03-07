import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { getAuthToken } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api-base";

type UseAdminMessagesParams = {
  startDate?: string;
  endDate?: string;
  status?: "sent" | "not_sent";
  sort?: "newest" | "oldest";
  page: number;
  limit: number;
  enabled?: boolean;
};

export function useAdminMessages(params: UseAdminMessagesParams) {
  return useQuery({
    queryKey: [
      "admin-messages",
      params.startDate ?? "",
      params.endDate ?? "",
      params.status ?? "",
      params.sort ?? "newest",
      String(params.page),
      String(params.limit),
    ],
    enabled: params.enabled ?? true,
    queryFn: async () => {
      const token = getAuthToken();
      const apiBase = getApiBaseUrl();
      const query = new URLSearchParams();
      query.set("page", String(params.page));
      query.set("limit", String(params.limit));
      if (params.startDate) {
        query.set("startDate", params.startDate);
      }
      if (params.endDate) {
        query.set("endDate", params.endDate);
      }
      if (params.status) {
        query.set("status", params.status);
      }
      if (params.sort) {
        query.set("sort", params.sort);
      }

      const res = await fetch(`${apiBase}${api.admin.messages.list.path}?${query.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });

      const contentType = res.headers.get("content-type") ?? "";
      const rawBody = await res.text();
      const isJson = contentType.includes("application/json");

      if (!isJson) {
        throw new Error(
          "Admin API returned non-JSON response. Open the app on port 5000 and verify /api/admin/messages is reachable.",
        );
      }

      let data: unknown;
      try {
        data = JSON.parse(rawBody);
      } catch (_error) {
        throw new Error("Invalid JSON response from admin API");
      }

      if (!res.ok) {
        const errorMessage =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as { message?: unknown }).message === "string"
            ? (data as { message: string }).message
            : "Failed to fetch admin messages";
        throw new Error(errorMessage);
      }

      return api.admin.messages.list.responses[200].parse(data);
    },
  });
}
