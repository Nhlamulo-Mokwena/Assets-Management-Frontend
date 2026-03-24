import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Wrench,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  ChevronDown,
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PencilLine,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface MaintenanceLog {
  id: string;
  asset: {
    id: string;
    assetName: string;
    category: string;
    assetSerialNumber?: string;
  };
  issue: string;
  severity: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "resolved";
  technicianName?: string;
  startDate: string;
  resolvedDate?: string;
  cost?: number;
  notes?: string;
  createdAt: string;
}

const severities = ["All", "low", "medium", "high"];
const statuses = ["All", "pending", "in_progress", "resolved"];

const severityStyle = (s: string) => {
  if (s === "high")
    return "text-red-400 bg-red-400/10 border border-red-400/20";
  if (s === "medium")
    return "text-amber-400 bg-amber-400/10 border border-amber-400/20";
  return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
};

const statusStyle = (s: string) => {
  if (s === "resolved")
    return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
  if (s === "in_progress")
    return "text-violet-400 bg-violet-400/10 border border-violet-400/20";
  return "text-amber-400 bg-amber-400/10 border border-amber-400/20";
};

const statusIcon = (s: string) => {
  if (s === "resolved")
    return <CheckCircle size={11} className="text-teal-400" />;
  if (s === "in_progress")
    return <Clock size={11} className="text-violet-400" />;
  return <AlertTriangle size={11} className="text-amber-400" />;
};

const statusLabel = (s: string) => {
  if (s === "in_progress") return "In Progress";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getDaysOpen = (startDate: string, resolvedDate?: string) => {
  const end = resolvedDate ? new Date(resolvedDate) : new Date();
  return Math.floor(
    (end.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
  );
};

const MaintenanceLogsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/maintenance", {
        headers,
      });
      if (res.status === 200) setLogs(res.data);
    } catch (error) {
      toast.error("Failed to load maintenance logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.asset.assetName.toLowerCase().includes(search.toLowerCase()) ||
      l.issue.toLowerCase().includes(search.toLowerCase()) ||
      l.technicianName?.toLowerCase().includes(search.toLowerCase()) ||
      l.asset.category.toLowerCase().includes(search.toLowerCase());
    const matchSeverity =
      selectedSeverity === "All" || l.severity === selectedSeverity;
    const matchStatus = selectedStatus === "All" || l.status === selectedStatus;
    return matchSearch && matchSeverity && matchStatus;
  });

  const pending = logs.filter((l) => l.status === "pending").length;
  const inProgress = logs.filter((l) => l.status === "in_progress").length;
  const resolved = logs.filter((l) => l.status === "resolved").length;
  const highSeverity = logs.filter((l) => l.severity === "high").length;

  return (
    <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans">
      {/* Header */}
      <div className="px-9 pt-8 pb-6 border-b border-white/5 bg-[#0f1117] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/user-home/${user?.sub}`)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-white/60" />
          </button>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">
              Maintenance
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Maintenance Logs
            </h1>
          </div>
        </div>
        <button
          onClick={() => navigate(`/user-home/${user?.sub}/add-maintenance`)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
        >
          <Plus size={13} /> Log Maintenance
        </button>
      </div>

      <div className="px-9 py-7">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-3.5 mb-7">
          {[
            {
              label: "Total Logs",
              value: logs.length,
              color: "text-white",
              bg: "bg-white/[0.03]",
              border: "border-white/[0.06]",
              iconBg: "bg-white/5",
              icon: Wrench,
              iconColor: "text-white/30",
            },
            {
              label: "Pending",
              value: pending,
              color: "text-amber-400",
              bg: "bg-amber-400/5",
              border: "border-amber-400/15",
              iconBg: "bg-amber-400/10",
              icon: AlertTriangle,
              iconColor: "text-amber-400",
            },
            {
              label: "In Progress",
              value: inProgress,
              color: "text-violet-400",
              bg: "bg-violet-400/5",
              border: "border-violet-400/15",
              iconBg: "bg-violet-400/10",
              icon: Clock,
              iconColor: "text-violet-400",
            },
            {
              label: "High Severity",
              value: highSeverity,
              color: "text-red-400",
              bg: "bg-red-400/5",
              border: "border-red-400/15",
              iconBg: "bg-red-400/10",
              icon: XCircle,
              iconColor: "text-red-400",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`${card.bg} border ${card.border} rounded-xl p-5`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}
                >
                  <card.icon
                    size={16}
                    className={card.iconColor}
                    strokeWidth={1.8}
                  />
                </div>
              </div>
              <p
                className={`text-3xl font-semibold tracking-tight mb-0.5 ${card.color}`}
              >
                {card.value}
              </p>
              <p className="text-xs text-white/35">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              type="text"
              placeholder="Search by asset, issue, technician..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-all"
            />
          </div>

          {/* Severity Filter */}
          <div className="relative">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 pr-8 py-2 text-xs text-white/60 outline-none appearance-none cursor-pointer focus:border-amber-400/40 transition-all"
            >
              {severities.map((s) => (
                <option key={s} value={s} className="bg-[#0f1117]">
                  {s === "All"
                    ? "All Severities"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 pr-8 py-2 text-xs text-white/60 outline-none appearance-none cursor-pointer focus:border-amber-400/40 transition-all"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-[#0f1117]">
                  {s === "All" ? "All Statuses" : statusLabel(s)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
          </div>

          <span className="text-[11px] text-white/25 ml-auto">
            {filtered.length} {filtered.length === 1 ? "log" : "logs"}
          </span>
        </div>

        {/* Table */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  "Asset",
                  "Issue",
                  "Severity",
                  "Status",
                  "Technician",
                  "Start Date",
                  "Resolved",
                  "Days Open",
                  "Cost (R)",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold tracking-widest uppercase text-white/20 border-b border-white/[0.04]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-5 py-12 text-center text-xs text-white/25"
                  >
                    Loading maintenance logs...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Wrench
                        size={24}
                        className="text-white/10"
                        strokeWidth={1.5}
                      />
                      <p className="text-xs text-white/25">
                        No maintenance logs found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Asset */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-400/10 flex items-center justify-center shrink-0">
                          <Package
                            size={11}
                            className="text-amber-400"
                            strokeWidth={1.8}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium">
                            {log.asset.assetName}
                          </p>
                          <p className="text-[10px] text-white/25">
                            {log.asset.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Issue */}
                    <td className="px-5 py-3.5 max-w-[180px]">
                      <p className="text-xs text-white/70 truncate">
                        {log.issue}
                      </p>
                    </td>

                    {/* Severity */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${severityStyle(log.severity)}`}
                      >
                        {log.severity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full w-fit ${statusStyle(log.status)}`}
                      >
                        {statusIcon(log.status)}
                        {statusLabel(log.status)}
                      </span>
                    </td>

                    {/* Technician */}
                    <td className="px-5 py-3.5 text-xs text-white/40">
                      {log.technicianName || "—"}
                    </td>

                    {/* Start Date */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-white/20" />
                        <span className="text-xs text-white/40">
                          {formatDate(log.startDate)}
                        </span>
                      </div>
                    </td>

                    {/* Resolved Date */}
                    <td className="px-5 py-3.5 text-xs text-white/30">
                      {log.resolvedDate ? formatDate(log.resolvedDate) : "—"}
                    </td>

                    {/* Days Open */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Clock size={10} className="text-white/20" />
                        <span
                          className={`text-xs ${
                            getDaysOpen(log.startDate, log.resolvedDate) > 7
                              ? "text-red-400"
                              : "text-white/40"
                          }`}
                        >
                          {getDaysOpen(log.startDate, log.resolvedDate)}d
                        </span>
                      </div>
                    </td>

                    {/* Cost */}
                    <td className="px-5 py-3.5 text-xs text-white/40">
                      {log.cost
                        ? `R ${Number(log.cost).toLocaleString()}`
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            navigate(
                              `/user-home/${user?.sub}/edit-maintenance/${log.id}`,
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <PencilLine size={12} className="text-white/50" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/user-home/${user?.sub}/delete-maintenance/${log.id}`,
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center hover:bg-red-400/20 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceLogsPage;
