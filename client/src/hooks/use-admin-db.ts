import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { getAuthToken } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api-base";

type UseAdminDbParams = {
  sort: "newest" | "oldest";
  enabled?: boolean;
};

export function useAdminDb(params: UseAdminDbParams) {
  return useQuery({
    queryKey: ["admin-db", params.sort],
    enabled: params.enabled ?? true,
    queryFn: async () => {
      const token = getAuthToken();
      const apiBase = getApiBaseUrl();
      const query = new URLSearchParams();
      query.set("sort", params.sort);

      const res = await fetch(`${apiBase}${api.admin.db.list.path}?${query.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });

      const contentType = res.headers.get("content-type") ?? "";
      const rawBody = await res.text();
      if (!contentType.includes("application/json")) {
        throw new Error("Admin DB API returned non-JSON response");
      }

      let data: unknown;
      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new Error("Invalid JSON response from admin DB API");
      }

      if (!res.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as { message?: unknown }).message === "string"
            ? (data as { message: string }).message
            : "Failed to fetch admin DB data";
        throw new Error(message);
      }

      return api.admin.db.list.responses[200].parse(data);
    },
  });
}
