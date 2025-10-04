import React, { useMemo, useState } from 'react';
import Button from './ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/DropdownMenu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import Input from './ui/Input';
import Badge from './ui/Badge';

type Severity = "low" | "medium" | "high";
type Status = "open" | "in-progress" | "closed";

type Incident = {
  id: string;
  receivedAt: string;
  user: string;
  subject: string;
  confidence: number;
  severity: Severity;
  status: Status;
  source: "Email Gateway" | "User Report" | "SIEM" | "Other";
};

const INCIDENTS: Incident[] = [
  {
    id: "INC-1048",
    receivedAt: "2025-10-02 09:41",
    user: "sara@acme.com",
    subject: "Password Reset Required",
    confidence: 0.92,
    severity: "high",
    status: "open",
    source: "Email Gateway",
  },
  {
    id: "INC-1047",
    receivedAt: "2025-10-02 08:13",
    user: "liam@acme.com",
    subject: "Invoice Overdue - Action Needed",
    confidence: 0.81,
    severity: "medium",
    status: "in-progress",
    source: "User Report",
  },
  {
    id: "INC-1046",
    receivedAt: "2025-10-01 18:30",
    user: "nora@acme.com",
    subject: "Unusual Sign-in Attempt",
    confidence: 0.67,
    severity: "low",
    status: "closed",
    source: "SIEM",
  },
  {
    id: "INC-1045",
    receivedAt: "2025-10-01 17:54",
    user: "paul@acme.com",
    subject: "Payroll Update Doc",
    confidence: 0.88,
    severity: "high",
    status: "open",
    source: "Email Gateway",
  },
  {
    id: "INC-1044",
    receivedAt: "2025-10-01 15:22",
    user: "olivia@acme.com",
    subject: "Microsoft 365 Validation Needed",
    confidence: 0.76,
    severity: "medium",
    status: "open",
    source: "Other",
  },
];

function SeverityBadge({ severity }: { severity: Severity }) {
  if (severity === "high") return <Badge variant="destructive">High</Badge>;
  if (severity === "medium") return <Badge variant="secondary">Medium</Badge>;
  return <Badge variant="outline">Low</Badge>;
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "open") return <Badge>Open</Badge>;
  if (status === "in-progress") return <Badge variant="accent">In Progress</Badge>;
  return <Badge variant="outline">Closed</Badge>;
}

const IncidentsTable: React.FC = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [severity, setSeverity] = useState<Severity | "all">("all");

  const filtered = useMemo(() => {
    return INCIDENTS.filter((i) => {
      const matchesQuery =
        i.id.toLowerCase().includes(query.toLowerCase()) ||
        i.user.toLowerCase().includes(query.toLowerCase()) ||
        i.subject.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" ? true : i.status === status;
      const matchesSeverity = severity === "all" ? true : i.severity === severity;
      return matchesQuery && matchesStatus && matchesSeverity;
    });
  }, [query, status, severity]);

  return (
    <div className="rounded-lg border bg-card glass-effect">
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between border-b">
        <div>
          <h2 className="text-base font-medium">Incidents</h2>
          <p className="text-xs text-muted-foreground">Triage and respond to suspected phishing</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Search ID, user, subject"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64"
            aria-label="Search incidents"
          />
          <div className="flex items-center gap-2">
            <select
              aria-label="Filter by status"
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <select
              aria-label="Filter by severity"
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Received</TableHead>
              <TableHead className="whitespace-nowrap">User</TableHead>
              <TableHead className="whitespace-nowrap">Subject</TableHead>
              <TableHead className="whitespace-nowrap text-right">Confidence</TableHead>
              <TableHead className="whitespace-nowrap">Severity</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.id}</TableCell>
                <TableCell>{i.receivedAt}</TableCell>
                <TableCell>{i.user}</TableCell>
                <TableCell className="max-w-[280px] truncate">{i.subject}</TableCell>
                <TableCell className="text-right">{Math.round(i.confidence * 100)}%</TableCell>
                <TableCell>
                  <SeverityBadge severity={i.severity} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={i.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert(`Viewing ${i.id}`)}>View details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Responding to ${i.id}`)}>Respond</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert(`Dismissing ${i.id}`)}>Dismiss</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                  No incidents match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IncidentsTable;
