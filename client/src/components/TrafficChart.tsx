import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: "D-13", detections: 62, escalated: 7 },
  { day: "D-12", detections: 54, escalated: 6 },
  { day: "D-11", detections: 70, escalated: 9 },
  { day: "D-10", detections: 81, escalated: 11 },
  { day: "D-9", detections: 76, escalated: 9 },
  { day: "D-8", detections: 89, escalated: 12 },
  { day: "D-7", detections: 93, escalated: 10 },
  { day: "D-6", detections: 88, escalated: 9 },
  { day: "D-5", detections: 95, escalated: 13 },
  { day: "D-4", detections: 101, escalated: 12 },
  { day: "D-3", detections: 97, escalated: 10 },
  { day: "D-2", detections: 110, escalated: 14 },
  { day: "D-1", detections: 104, escalated: 12 },
  { day: "Today", detections: 109, escalated: 13 },
];

const TrafficChart: React.FC = () => {
  const line1 = "var(--color-chart-1)";
  const line2 = "var(--color-chart-3)";
  const grid = "var(--color-border)";
  const text = "var(--color-muted-foreground)";

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fill: text, fontSize: 12 }} axisLine={{ stroke: grid }} />
          <YAxis tick={{ fill: text, fontSize: 12 }} axisLine={{ stroke: grid }} />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              color: "var(--color-foreground)",
              borderRadius: "var(--radius-md)",
            }}
          />
          <Line type="monotone" dataKey="detections" stroke={line1} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="escalated" stroke={line2} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;
