type JwtPayload = {
  email?: string;
  role?: string;
  exp?: number;
};

const ADMIN_TOKEN_KEY = "auth_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function parseJwtPayload(token: string | null): JwtPayload | null {
  if (!token) {
    return null;
  }

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) {
      return null;
    }
    return JSON.parse(atob(payloadBase64)) as JwtPayload;
  } catch (_error) {
    return null;
  }
}

export function getUserRoleFromToken(token: string | null): string | null {
  const payload = parseJwtPayload(token);
  return payload?.role ?? null;
}

export function getUserEmailFromToken(token: string | null): string | null {
  const payload = parseJwtPayload(token);
  return payload?.email ?? null;
}

export function isAdminToken(token: string | null): boolean {
  return getUserRoleFromToken(token) === "admin";
}
