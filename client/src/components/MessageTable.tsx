import type { Message } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MessageTableProps = {
  messages: Message[];
  page: number;
  totalPages: number;
  limit?: number;
  onPageChange: (page: number) => void;
};

function formatDate(value: Date | string | null): string {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  const hours24 = date.getUTCHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const ampm = hours24 >= 12 ? "PM" : "AM";

  return `${day}/${month}/${year} ${String(hours12).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
}

export function MessageTable({
  messages,
  page,
  totalPages,
  limit = 10,
  onPageChange,
}: MessageTableProps) {
  return (
    <div className="space-y-4">
      <div className="max-h-[420px] overflow-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>DB Status</TableHead>
              <TableHead>Mail Status</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell className="max-w-[360px] truncate">{item.message}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-600 text-white border-transparent">Saved</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.status === "failed" || item.status === "not_sent"
                          ? "bg-red-600 text-white border-transparent"
                          : "bg-emerald-600 text-white border-transparent"
                      }
                    >
                      {item.status === "failed" || item.status === "not_sent" ? "Not Sent" : "Sent"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) {
                  onPageChange(page - 1);
                }
              }}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="text-sm px-3 text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) {
                  onPageChange(page + 1);
                }
              }}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
