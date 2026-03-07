import { z } from 'zod';
import { insertMessageSchema, messages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  messages: {
    create: {
      method: 'POST' as const,
      path: '/api/messages' as const,
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  admin: {
    login: {
      method: "POST" as const,
      path: "/api/admin/login" as const,
      input: z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
      responses: {
        200: z.object({
          token: z.string(),
          email: z.string().email(),
          role: z.literal("admin"),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    messages: {
      list: {
        method: "GET" as const,
        path: "/api/admin/messages" as const,
        responses: {
          200: z.object({
            items: z.array(z.custom<typeof messages.$inferSelect>()),
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
            stats: z
              .object({
                sent: z.number(),
                notSent: z.number(),
              })
              .default({
                sent: 0,
                notSent: 0,
              }),
          }),
          401: errorSchemas.unauthorized,
          403: errorSchemas.unauthorized,
        },
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
