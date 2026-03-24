import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Wrench,
  Package,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface MaintenanceLog {
  id: string;
  asset: { assetName: string; category: string };
  loggedBy?: { firstName: string; lastName: string };
  issue: string;
  severity: string;
  status: string;
  technicianName?: string;
  startDate: string;
  resolvedDate?: string;
  cost?: number;
  notes?: string;
}

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

const statusLabel = (s: string) => {
  if (s === "in_progress") return "In Progress";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const DeleteMaintenancePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [log, setLog] = useState<MaintenanceLog | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/maintenance/${id}`, {
          headers,
        });
        if (res.status === 200) setLog(res.data);
      } catch {
        toast.error("Failed to load maintenance log.");
        navigate(`/user-home/${user?.sub}/maintenance`);
      } finally {
        setFetching(false);
      }
    };
    fetchLog();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/maintenance/${id}`, {
        headers,
      });
      toast.success("Maintenance log deleted successfully.");
      navigate(`/user-home/${user?.sub}/maintenance`);
    } catch {
      toast.error("Failed to delete maintenance log.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans flex items-center justify-center">
        <p className="text-xs text-white/25">Loading maintenance log...</p>
      </div>
    );
  }

  if (!log) return null;

  return (
    <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans">
      {/* Header */}
      <div className="px-9 pt-8 pb-6 border-b border-white/5 bg-[#0f1117] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/user-home/${user?.sub}/maintenance`)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-white/60" />
          </button>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">
              Maintenance
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Delete Maintenance Log
            </h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center">
          <Trash2 size={14} className="text-red-400" strokeWidth={1.8} />
        </div>
      </div>

      <div className="px-9 py-8 max-w-2xl">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 px-4 py-3.5 bg-red-400/5 border border-red-400/15 rounded-xl mb-6">
          <AlertTriangle
            size={15}
            className="text-red-400 shrink-0 mt-0.5"
            strokeWidth={1.8}
          />
          <div>
            <p className="text-xs font-semibold text-red-400 mb-0.5">
              This action cannot be undone
            </p>
            <p className="text-[11px] text-white/35">
              Deleting this maintenance log will permanently remove it. The
              associated asset will be set back to Available if not yet
              resolved.
            </p>
          </div>
        </div>

        {/* Log Details */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Wrench size={13} className="text-amber-400" strokeWidth={1.8} />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Maintenance log to be deleted
            </span>
          </div>

          {/* Asset + Badges */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                <Package
                  size={16}
                  className="text-amber-400"
                  strokeWidth={1.8}
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{log.asset.assetName}</p>
                <p className="text-[11px] text-white/30">
                  {log.asset.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${severityStyle(log.severity)}`}
              >
                {log.severity}
              </span>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusStyle(log.status)}`}
              >
                {statusLabel(log.status)}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-2 gap-4">
            {[
              {
                icon: AlertTriangle,
                label: "Issue",
                value: log.issue,
                span: true,
              },
              {
                icon: User,
                label: "Technician",
                value: log.technicianName || "—",
              },
              {
                icon: User,
                label: "Logged By",
                value: log.loggedBy
                  ? `${log.loggedBy.firstName} ${log.loggedBy.lastName}`
                  : "—",
              },
              {
                icon: Calendar,
                label: "Start Date",
                value: formatDate(log.startDate),
              },
              {
                icon: Clock,
                label: "Resolved Date",
                value: log.resolvedDate ? formatDate(log.resolvedDate) : "—",
              },
              {
                icon: Wrench,
                label: "Cost",
                value: log.cost
                  ? `R ${Number(log.cost).toLocaleString()}`
                  : "—",
              },
            ].map((field) => (
              <div
                key={field.label}
                className={`flex items-start gap-3 ${field.span ? "col-span-2" : ""}`}
              >
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                  <field.icon size={12} className="text-white/25" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-0.5">
                    {field.label}
                  </p>
                  <p className="text-sm text-white/70">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/user-home/${user?.sub}/maintenance`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} /> Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMaintenancePage;
