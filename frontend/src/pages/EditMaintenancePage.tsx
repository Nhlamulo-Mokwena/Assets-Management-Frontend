import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Wrench,
  ArrowLeft,
  Save,
  X,
  Package,
  User,
  Calendar,
  DollarSign,
  FileText,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface FormData {
  assetId: string;
  issue: string;
  severity: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "resolved";
  technicianName: string;
  startDate: string;
  resolvedDate: string;
  cost: string;
  notes: string;
}

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/60 focus:bg-amber-400/[0.03] transition-all duration-200";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2";

const severityOptions = ["low", "medium", "high"];
const statusOptions = ["pending", "in_progress", "resolved"];

const severityStyle = (s: string) => {
  if (s === "high") return "text-red-400";
  if (s === "medium") return "text-amber-400";
  return "text-teal-400";
};

const formatDateInput = (date: string | null | undefined) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const EditMaintenancePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>({
    assetId: "",
    issue: "",
    severity: "low",
    status: "pending",
    technicianName: "",
    startDate: "",
    resolvedDate: "",
    cost: "",
    notes: "",
  });
  const [assetName, setAssetName] = useState("");
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
        if (res.status === 200) {
          const log = res.data;
          setAssetName(log.asset?.assetName ?? "");
          setForm({
            assetId: log.asset?.id ?? "",
            issue: log.issue ?? "",
            severity: log.severity ?? "low",
            status: log.status ?? "pending",
            technicianName: log.technicianName ?? "",
            startDate: formatDateInput(log.startDate),
            resolvedDate: formatDateInput(log.resolvedDate),
            cost: log.cost ? String(log.cost) : "",
            notes: log.notes ?? "",
          });
        }
      } catch {
        toast.error("Failed to load maintenance log.");
        navigate(`/user-home/${user?.sub}/maintenance`);
      } finally {
        setFetching(false);
      }
    };
    fetchLog();
  }, [id]);

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.issue) {
      toast.error("Please describe the issue.");
      return;
    }
    if (!form.startDate) {
      toast.error("Please provide a start date.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        issue: form.issue,
        severity: form.severity,
        status: form.status,
        technicianName: form.technicianName || null,
        startDate: form.startDate,
        resolvedDate: form.resolvedDate || null,
        cost: form.cost ? Number(form.cost) : null,
        notes: form.notes || null,
      };

      const res = await axios.patch(
        `http://localhost:3000/maintenance/${id}`,
        payload,
        { headers },
      );
      if (res.status === 200) {
        toast.success("Maintenance log updated successfully!");
        navigate(`/user-home/${user?.sub}/maintenance`);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message ?? "Failed to update maintenance log.");
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
              Edit Maintenance Log
            </h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <Wrench size={14} className="text-amber-400" strokeWidth={1.8} />
        </div>
      </div>

      <div className="px-9 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset (read only) */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Package size={13} className="text-amber-400" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Asset
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-400/5 border border-amber-400/15 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                  <Package
                    size={14}
                    className="text-amber-400"
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{assetName}</p>
                  <p className="text-[11px] text-white/30">
                    Asset cannot be changed after creation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Details */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <AlertTriangle
                size={13}
                className="text-red-400"
                strokeWidth={1.8}
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Issue Details
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className={labelClass}>Issue Description *</label>
                <textarea
                  rows={3}
                  value={form.issue}
                  onChange={(e) => set("issue")(e.target.value)}
                  placeholder="Describe the issue or reason for maintenance..."
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>

              {/* Severity */}
              <div>
                <label className={labelClass}>Severity *</label>
                <div className="relative">
                  <AlertTriangle
                    size={14}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${severityStyle(form.severity)}`}
                  />
                  <select
                    value={form.severity}
                    onChange={(e) =>
                      set("severity")(
                        e.target.value as "low" | "medium" | "high",
                      )
                    }
                    className={`${inputClass} pl-10 pr-10 appearance-none cursor-pointer`}
                  >
                    {severityOptions.map((s) => (
                      <option key={s} value={s} className="bg-[#0f1117]">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>Status *</label>
                <div className="relative">
                  <Wrench
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                  <select
                    value={form.status}
                    onChange={(e) =>
                      set("status")(
                        e.target.value as
                          | "pending"
                          | "in_progress"
                          | "resolved",
                      )
                    }
                    className={`${inputClass} pl-10 pr-10 appearance-none cursor-pointer`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="bg-[#0f1117]">
                        {s === "in_progress"
                          ? "In Progress"
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Technician & Dates */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <User size={13} className="text-teal-400" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Technician & Dates
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className={labelClass}>Technician Name</label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={form.technicianName}
                    onChange={(e) => set("technicianName")(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Start Date *</label>
                <div className="relative">
                  <Calendar
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => set("startDate")(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Resolved Date</label>
                <div className="relative">
                  <Calendar
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                  <input
                    type="date"
                    value={form.resolvedDate}
                    onChange={(e) => set("resolvedDate")(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cost & Notes */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <DollarSign
                size={13}
                className="text-violet-400"
                strokeWidth={1.8}
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Cost & Notes
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Maintenance Cost (R)</label>
                <div className="relative">
                  <DollarSign
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                  />
                  <input
                    type="number"
                    value={form.cost}
                    onChange={(e) => set("cost")(e.target.value)}
                    placeholder="e.g. 1500"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Additional Notes</label>
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-4 top-3.5 text-white/25 pointer-events-none"
                  />
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set("notes")(e.target.value)}
                    placeholder="Any additional details about the maintenance..."
                    className={`${inputClass} pl-10 resize-none leading-relaxed`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate(`/user-home/${user?.sub}/maintenance`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={13} /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Save size={13} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenancePage;
