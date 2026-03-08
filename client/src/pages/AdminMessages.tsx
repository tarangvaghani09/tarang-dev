import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AdminMessageStatusChart } from "@/components/AdminMessageStatusChart";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { MessageTable } from "@/components/MessageTable";
import { useAdminMessages } from "@/hooks/use-admin-messages";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  clearAuthToken,
  getAuthToken,
  getUserEmailFromToken,
  isAdminToken,
} from "@/lib/auth";
import type { DateRange } from "react-day-picker";

const ADMIN_EMAIL = "tarangvaghani@gmail.com";

function toIsoDate(date?: Date): string | undefined {
  if (!date) {
    return undefined;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminMessages() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const today = new Date();
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: undefined,
  });
  const [statusFilter, setStatusFilter] = useState<"all" | "sent" | "not_sent">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const token = getAuthToken();
  const isAllowedAdmin =
    isAdminToken(token) && getUserEmailFromToken(token) === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAllowedAdmin) {
      setLocation("/admin");
    }
  }, [isAllowedAdmin, setLocation]);

  const queryParams = useMemo(
    () => ({
      startDate: toIsoDate(dateRange?.from),
      endDate: toIsoDate(dateRange?.to),
      status: statusFilter === "all" ? undefined : statusFilter,
      sort: sortOrder,
      page,
      limit: 10,
      enabled: isAllowedAdmin,
    }),
    [dateRange, statusFilter, sortOrder, page, isAllowedAdmin],
  );

  const { data, isLoading, error } = useAdminMessages(queryParams);
  const sortedItems = useMemo(() => {
    const items = [...(data?.items ?? [])];
    items.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
    });
    return items;
  }, [data?.items, sortOrder]);

  const handleLogout = () => {
    clearAuthToken();
    toast({
      title: "Logged out",
      description: "Admin token removed from local storage",
    });
    setLocation("/admin");
  };

  if (!isAllowedAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Contact messages with delivery status and date filters.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setLocation("/admin/db")}>
              DB View
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DateRangeFilter
            range={dateRange}
            onRangeChange={(range) => {
              setDateRange(range);
              setPage(1);
            }}
          />
          <AdminMessageStatusChart
            sent={data?.stats.sent ?? 0}
            notSent={data?.stats.notSent ?? 0}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Status</p>
            <Select
              value={statusFilter}
              onValueChange={(value: "all" | "sent" | "not_sent") => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="not_sent">Not Sent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Sort</p>
            <Select
              value={sortOrder}
              onValueChange={(value: "newest" | "oldest") => {
                setSortOrder(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border p-6 text-muted-foreground">Loading messages...</div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-destructive">
            {(error as Error).message}
          </div>
        ) : (
          <MessageTable
            messages={sortedItems}
            page={data?.page ?? 1}
            limit={data?.limit ?? 10}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        )}
      </div>
    </main>
  );
}
