import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type AdminMessageStatusChartProps = {
  sent: number;
  notSent: number;
};

const COLORS = {
  sent: "#10b981",
  notSent: "#ef4444",
};

export function AdminMessageStatusChart({
  sent,
  notSent,
}: AdminMessageStatusChartProps) {
  const data = [
    { name: "Sent", value: sent, color: COLORS.sent },
    { name: "Not Sent", value: notSent, color: COLORS.notSent },
  ];

  return (
    <div className="rounded-xl border p-4 bg-card h-full">
      <p className="text-sm font-semibold mb-2">Message Delivery Status</p>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={88}
              innerRadius={52}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
