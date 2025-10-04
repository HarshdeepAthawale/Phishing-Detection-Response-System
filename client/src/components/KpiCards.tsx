import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const kpis = [
  { label: "Total Detections", value: "1,284", hint: "+12% vs last week" },
  { label: "Open Incidents", value: "37", hint: "-5% vs last week" },
  { label: "Avg. Response Time", value: "14m", hint: "-2m vs last week" },
  { label: "User Reports", value: "96", hint: "+8% vs last week" },
];

const KpiCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <Card key={k.label} className="bg-card glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{k.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{k.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{k.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KpiCards;
