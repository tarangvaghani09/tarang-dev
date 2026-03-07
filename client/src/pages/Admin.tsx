import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getApiBaseUrl } from "@/lib/api-base";
import {
  getAuthToken,
  getUserEmailFromToken,
  isAdminToken,
  setAuthToken,
} from "@/lib/auth";

const ADMIN_EMAIL = "tarangvaghani@gmail.com";

export default function Admin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (isAdminToken(token) && getUserEmailFromToken(token) === ADMIN_EMAIL) {
      setLocation("/admin/messages");
    }
  }, [setLocation]);

  const handleAdminLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoggingIn(true);

    try {
      const payload = api.admin.login.input.parse({ email, password });
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}${api.admin.login.path}`, {
        method: api.admin.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") ?? "";
      const raw = await res.text();
      const isJson = contentType.includes("application/json");
      if (!isJson) {
        throw new Error(
          "Admin login API returned non-JSON response. Open the app from http://localhost:5000 and try again.",
        );
      }

      const data = raw ? JSON.parse(raw) : {};
      if (!res.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as { message?: unknown }).message === "string"
            ? (data as { message: string }).message
            : "Admin login failed";
        throw new Error(message);
      }

      const parsed = api.admin.login.responses[200].parse(data);
      setAuthToken(parsed.token);
      toast({
        title: "Admin login successful",
        description: `Logged in as ${parsed.email}`,
      });
      setLocation("/admin/messages");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Admin login failed",
        description: error instanceof Error ? error.message : "Unable to login",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-md mx-auto mt-20 rounded-xl border p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Login with admin email to generate and store token in local storage.
          </p>
        </div>
        <form onSubmit={handleAdminLogin} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? "Signing in..." : "Sign in as Admin"}
          </Button>
        </form>
      </div>
    </main>
  );
}
