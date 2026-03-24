import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Search,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface Asset {
  id: string;
  assetName: string;
  category: string;
  assetSerialNumber?: string;
  status: string;
}

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

const initialForm: FormData = {
  assetId: "",
  issue: "",
  severity: "low",
  status: "pending",
  technicianName: "",
  startDate: new Date().toISOString().split("T")[0],
  resolvedDate: "",
  cost: "",
  notes: "",
};

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

const AddMaintenancePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(initialForm);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get("http://localhost:3000/assets", {
          headers,
        });
        if (res.status === 200) setAssets(res.data);
      } catch {
        toast.error("Failed to load assets.");
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchAssets();
  }, []);

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const filteredAssets = assets.filter(
    (a) =>
      a.assetName.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.assetSerialNumber?.toLowerCase().includes(assetSearch.toLowerCase()),
  );

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setForm((prev) => ({ ...prev, assetId: asset.id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.assetId) {
      toast.error("Please select an asset.");
      return;
    }
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
        assetId: form.assetId,
        issue: form.issue,
        severity: form.severity,
        status: form.status,
        technicianName: form.technicianName || null,
        startDate: form.startDate,
        resolvedDate: form.resolvedDate || null,
        cost: form.cost ? Number(form.cost) : null,
        notes: form.notes || null,
      };

      const res = await axios.post(
        "http://localhost:3000/maintenance",
        payload,
        { headers },
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Maintenance log created successfully!");
        navigate(`/user-home/${user?.sub}/maintenance`);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message ?? "Failed to create maintenance log.");
    } finally {
      setLoading(false);
    }
  };

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
              Log Maintenance
            </h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <Wrench size={14} className="text-amber-400" strokeWidth={1.8} />
        </div>
      </div>

      <div className="px-9 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Asset */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package
                  size={13}
                  className="text-amber-400"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Select Asset
                </span>
              </div>
              {selectedAsset && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-lg">
                  <Package size={11} className="text-amber-400" />
                  <span className="text-[11px] text-amber-400 font-medium">
                    {selectedAsset.assetName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAsset(null);
                      setForm((prev) => ({ ...prev, assetId: "" }));
                    }}
                    className="text-amber-400/50 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                />
                <input
                  type="text"
                  placeholder="Search by name, category, serial number..."
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {loadingAssets ? (
                  <p className="text-xs text-white/25 text-center py-4">
                    Loading assets...
                  </p>
                ) : filteredAssets.length === 0 ? (
                  <p className="text-xs text-white/25 text-center py-4">
                    No assets found
                  </p>
                ) : (
                  filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleSelectAsset(asset)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                        selectedAsset?.id === asset.id
                          ? "bg-amber-400/10 border-amber-400/30"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          selectedAsset?.id === asset.id
                            ? "bg-amber-400/20"
                            : "bg-white/5"
                        }`}
                      >
                        <Package
                          size={14}
                          className={
                            selectedAsset?.id === asset.id
                              ? "text-amber-400"
                              : "text-white/25"
                          }
                          strokeWidth={1.8}
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {asset.assetName}
                        </p>
                        <p className="text-[11px] text-white/35 truncate">
                          {asset.category}
                          {asset.assetSerialNumber &&
                            ` · ${asset.assetSerialNumber}`}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                          asset.status === "Available"
                            ? "text-violet-400 bg-violet-400/10 border-violet-400/20"
                            : asset.status === "In Use"
                              ? "text-teal-400 bg-teal-400/10 border-teal-400/20"
                              : "text-red-400 bg-red-400/10 border-red-400/20"
                        }`}
                      >
                        {asset.status}
                      </span>
                      {selectedAsset?.id === asset.id && (
                        <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                          >
                            <path
                              d="M1 4L3 6L7 2"
                              stroke="#000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))
                )}
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
              {/* Technician */}
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

              {/* Start Date */}
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

              {/* Resolved Date */}
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
              onClick={() => setForm(initialForm)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={13} /> Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Save size={13} />
              {loading ? "Saving..." : "Log Maintenance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenancePage;
