import React from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DetectionsDonut: React.FC = () => {
  const data = [
    { name: "Email Gateway", value: 52 },
    { name: "User Reports", value: 28 },
    { name: "SIEM", value: 14 },
    { name: "Other", value: 6 },
  ];

  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-5)"];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              color: "var(--color-foreground)",
              borderRadius: "var(--radius-md)",
            }}
          />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} stroke="var(--color-card)">
            {data.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="ml-auto font-medium">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectionsDonut;
