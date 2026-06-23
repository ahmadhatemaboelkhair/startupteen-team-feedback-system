"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { BarChart3, Download, ExternalLink, Filter, Loader2, LogIn, LogOut, Search } from "lucide-react";
import { scoreLabels } from "@/lib/submission";
import type { SubmissionRow } from "@/types/feedback";

type Filters = {
  school: string;
  tutor: string;
  group: string;
  team: string;
  sessionNumber: string;
  from: string;
  to: string;
};

const emptyFilters: Filters = {
  school: "",
  tutor: "",
  group: "",
  team: "",
  sessionNumber: "",
  from: "",
  to: ""
};

export function AdminDashboard() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    setLoading(true);
    fetch("/api/admin/submissions")
      .then((response) => response.json())
      .then((result) => {
        if (!result.ok) {
          throw new Error(result.error || "Unable to load submissions.");
        }
        setSubmissions(result.submissions ?? []);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load submissions."))
      .finally(() => setLoading(false));
  }, [status]);

  const filtered = useMemo(() => applyFilters(submissions, filters), [submissions, filters]);
  const analytics = useMemo(() => buildAnalytics(filtered), [filtered]);

  if (status === "loading") {
    return <AdminShell center={<Loader2 className="animate-spin text-brand-primary" size={42} />} />;
  }

  if (status !== "authenticated") {
    return (
      <AdminShell
        center={
          <section className="surface max-w-xl p-8 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
              <Image
                src="/startupteen-logo.svg"
                alt="StartupTeen"
                width={82}
                height={82}
                className="h-20 w-20 object-contain"
                priority
              />
            </div>
            <h1 className="mt-5 text-3xl font-black text-brand-ink">Admin Dashboard</h1>
            <p className="mt-3 text-slate-600">Sign in with an approved Google admin account.</p>
            <button
              onClick={() => signIn("google")}
              className="primary-button mt-7"
            >
              <LogIn size={18} />
              Sign in with Google
            </button>
          </section>
        }
      />
    );
  }

  return (
    <AdminShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow">
              <BarChart3 size={16} />
              Admin analytics
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight text-brand-ink">Feedback Dashboard</h1>
            <p className="mt-2 text-slate-600">Signed in as {session.user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => exportCsv(filtered)} className="admin-button">
              <Download size={17} />
              CSV
            </button>
            <button onClick={() => exportExcel(filtered)} className="admin-button">
              <Download size={17} />
              Excel
            </button>
            <button onClick={() => signOut()} className="admin-button">
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>

        {error && <div className="status-error mb-6">{error}</div>}

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total feedback" value={analytics.total.toString()} />
          <Metric label="Average score" value={`${analytics.average.toFixed(1)}/10`} />
          <Metric label="Top team" value={analytics.topTeam || "No data"} />
          <Metric label="Needs attention" value={analytics.needsAttention.toString()} />
        </section>

        <section className="surface mb-6 p-5">
          <div className="mb-4 flex items-center gap-2 text-lg font-black text-brand-ink">
            <Filter size={20} />
            Filters
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <FilterInput label="School" value={filters.school} onChange={(value) => updateFilter("school", value)} />
            <FilterInput label="Tutor" value={filters.tutor} onChange={(value) => updateFilter("tutor", value)} />
            <FilterInput label="Group" value={filters.group} onChange={(value) => updateFilter("group", value)} />
            <FilterInput label="Team" value={filters.team} onChange={(value) => updateFilter("team", value)} />
            <FilterInput
              label="Session Number"
              value={filters.sessionNumber}
              onChange={(value) => updateFilter("sessionNumber", value)}
            />
            <FilterInput label="From" type="date" value={filters.from} onChange={(value) => updateFilter("from", value)} />
            <FilterInput label="To" type="date" value={filters.to} onChange={(value) => updateFilter("to", value)} />
            <button
              onClick={() => setFilters(emptyFilters)}
              className="secondary-button mt-6"
            >
              Clear Filters
            </button>
          </div>
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-2">
          <Comparison title="School performance comparison" rows={analytics.schoolPerformance} />
          <Comparison title="Session performance comparison" rows={analytics.sessionPerformance} />
        </section>

        <section className="surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h2 className="text-xl font-black text-brand-ink">Submissions</h2>
            {loading && <Loader2 className="animate-spin text-brand-primary" size={22} />}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Submission</th>
                  <th className="px-4 py-3">Tutor</th>
                  <th className="px-4 py-3">School</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Avg Score</th>
                  <th className="px-4 py-3">Recommendation</th>
                  <th className="px-4 py-3">File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.submissionId} className="transition hover:bg-brand-sky/60">
                    <td className="px-4 py-4">
                      <p className="font-mono font-bold text-brand-primary">{row.submissionId}</p>
                      <p className="text-xs text-slate-500">{row.timestamp}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-brand-ink">{row.tutorName}</p>
                      <p className="text-xs text-slate-500">{row.tutorId}</p>
                    </td>
                    <td className="px-4 py-4">{row.school}</td>
                    <td className="px-4 py-4">
                      <p className="font-bold">{row.teamName}</p>
                      <p className="text-xs text-slate-500">{row.groupId}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p>{row.sessionNumber}</p>
                      <p className="text-xs text-slate-500">{row.sessionDate}</p>
                    </td>
                    <td className="px-4 py-4 font-black text-brand-ink">{rowAverage(row).toFixed(1)}</td>
                    <td className="px-4 py-4">{row.recommendation}</td>
                    <td className="px-4 py-4">
                      {row.uploadedFileUrl ? (
                        <a
                          className="inline-flex items-center gap-1 font-bold text-brand-primary"
                          href={row.uploadedFileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-12 text-center text-slate-500" colSpan={8}>
                      No submissions match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AdminShell>
  );

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }
}

function AdminShell({ children, center }: { children?: React.ReactNode; center?: React.ReactNode }) {
  if (center) {
    return <main className="grid min-h-[calc(100vh-81px)] place-items-center px-4 py-12">{center}</main>;
  }

  return <>{children}</>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-5">
      <p className="text-sm font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-brand-ink">{value}</p>
    </div>
  );
}

function FilterInput({
  label,
  value,
  type = "text",
  onChange
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-600">
        <Search size={14} />
        {label}
      </span>
      <input className="field" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Comparison({ title, rows }: { title: string; rows: Array<{ name: string; average: number; count: number }> }) {
  return (
    <div className="surface p-5">
      <h2 className="text-lg font-black text-brand-ink">{title}</h2>
      <div className="mt-5 space-y-4">
        {rows.slice(0, 6).map((row) => (
          <div key={row.name}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-slate-700">{row.name}</span>
              <span className="font-black text-brand-primary">{row.average.toFixed(1)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-primary" style={{ width: `${row.average * 10}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500">{row.count} submissions</p>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No data yet.</p>}
      </div>
    </div>
  );
}

function rowAverage(row: SubmissionRow) {
  const values = [
    row.presentationScore,
    row.ideaScore,
    row.technicalityScore,
    row.collaborationScore,
    row.attendanceScore,
    row.creativityScore,
    row.progressScore
  ].map(Number);
  return values.reduce((sum, value) => sum + value, 0) / values.length || 0;
}

function applyFilters(rows: SubmissionRow[], filters: Filters) {
  return rows.filter((row) => {
    const fields = {
      school: row.school,
      tutor: `${row.tutorName} ${row.tutorId}`,
      group: row.groupId,
      team: row.teamName,
      sessionNumber: row.sessionNumber
    };

    for (const [key, value] of Object.entries(filters)) {
      if (!value || key === "from" || key === "to") {
        continue;
      }
      if (!fields[key as keyof typeof fields]?.toLowerCase().includes(value.toLowerCase())) {
        return false;
      }
    }

    if (filters.from && row.sessionDate < filters.from) {
      return false;
    }
    if (filters.to && row.sessionDate > filters.to) {
      return false;
    }

    return true;
  });
}

function buildAnalytics(rows: SubmissionRow[]) {
  const total = rows.length;
  const average = total ? rows.reduce((sum, row) => sum + rowAverage(row), 0) / total : 0;
  const sorted = [...rows].sort((a, b) => rowAverage(b) - rowAverage(a));
  const needsAttention = rows.filter(
    (row) => row.recommendation === "Critical Attention Needed" || row.recommendation === "Needs Improvement"
  ).length;

  return {
    total,
    average,
    topTeam: sorted[0]?.teamName ?? "",
    needsAttention,
    schoolPerformance: groupPerformance(rows, "school"),
    sessionPerformance: groupPerformance(rows, "sessionNumber")
  };
}

function groupPerformance(rows: SubmissionRow[], key: "school" | "sessionNumber") {
  const groups = new Map<string, { total: number; count: number }>();
  rows.forEach((row) => {
    const name = row[key] || "Unknown";
    const current = groups.get(name) ?? { total: 0, count: 0 };
    current.total += rowAverage(row);
    current.count += 1;
    groups.set(name, current);
  });

  return Array.from(groups.entries())
    .map(([name, value]) => ({ name, average: value.total / value.count, count: value.count }))
    .sort((a, b) => b.average - a.average);
}

function exportCsv(rows: SubmissionRow[]) {
  downloadFile("startupteen-feedback.csv", "text/csv", toCsv(rows));
}

function exportExcel(rows: SubmissionRow[]) {
  const html = `<table>${toTableRows(rows)}</table>`;
  downloadFile("startupteen-feedback.xls", "application/vnd.ms-excel", html);
}

function toCsv(rows: SubmissionRow[]) {
  const headers = exportHeaders();
  const body = rows.map((row) => headers.map((header) => csvCell(valueForHeader(row, header))).join(","));
  return [headers.join(","), ...body].join("\n");
}

function toTableRows(rows: SubmissionRow[]) {
  const headers = exportHeaders();
  const head = `<tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>`;
  const body = rows
    .map((row) => `<tr>${headers.map((header) => `<td>${escapeHtml(String(valueForHeader(row, header)))}</td>`).join("")}</tr>`)
    .join("");
  return `${head}${body}`;
}

function exportHeaders() {
  return [
    "Timestamp",
    "Submission ID",
    "Tutor ID",
    "Tutor Name",
    "School",
    "Group ID",
    "Team Name",
    "Members Count",
    "Session Date",
    "Session Number",
    ...scoreLabels.map((score) => score.column),
    "Feedback Text",
    "Uploaded File URL",
    "Recommendation",
    "Additional Notes"
  ];
}

function valueForHeader(row: SubmissionRow, header: string) {
  const map: Record<string, unknown> = {
    Timestamp: row.timestamp,
    "Submission ID": row.submissionId,
    "Tutor ID": row.tutorId,
    "Tutor Name": row.tutorName,
    School: row.school,
    "Group ID": row.groupId,
    "Team Name": row.teamName,
    "Members Count": row.membersCount,
    "Session Date": row.sessionDate,
    "Session Number": row.sessionNumber,
    "Presentation Score": row.presentationScore,
    "Idea Score": row.ideaScore,
    "Technicality Score": row.technicalityScore,
    "Collaboration Score": row.collaborationScore,
    "Attendance Score": row.attendanceScore,
    "Creativity Score": row.creativityScore,
    "Progress Score": row.progressScore,
    "Feedback Text": row.feedbackText,
    "Uploaded File URL": row.uploadedFileUrl,
    Recommendation: row.recommendation,
    "Additional Notes": row.additionalNotes
  };
  return map[header] ?? "";
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return map[char];
  });
}

function downloadFile(filename: string, mimeType: string, contents: string) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
