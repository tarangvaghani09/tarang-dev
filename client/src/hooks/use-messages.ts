import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import { getApiBaseUrl } from "@/lib/api-base";

export function useCreateMessage() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertMessageSchema>) => {
      const validated = insertMessageSchema.parse(data);
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}${api.messages.create.path}`, {
        method: api.messages.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.messages.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to send message');
      }
      return api.messages.create.responses[201].parse(await res.json());
    },
  });
}
