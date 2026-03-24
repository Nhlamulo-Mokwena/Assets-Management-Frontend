import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  AlertTriangle,
  ArrowLeft,
  Save,
  X,
  Package,
  FileText,
  ChevronDown,
  Search,
  Flag,
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

interface Assignment {
  id: string;
  asset: Asset;
}

interface FormData {
  assetId: string;
  issue: string;
  severity: "low" | "medium" | "high";
  notes: string;
}

const initialForm: FormData = {
  assetId: "",
  issue: "",
  severity: "low",
  notes: "",
};

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/60 focus:bg-amber-400/[0.03] transition-all duration-200";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2";

const severityConfig = {
  low: {
    label: "Low",
    desc: "Minor issue, not urgent",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/30",
    dot: "bg-teal-400",
  },
  medium: {
    label: "Medium",
    desc: "Needs attention soon",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    dot: "bg-amber-400",
  },
  high: {
    label: "High",
    desc: "Urgent, affects work",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    dot: "bg-red-400",
  },
};

const commonIssues = [
  "Device not turning on",
  "Screen damage or cracked display",
  "Battery not charging",
  "Overheating",
  "Hardware malfunction",
  "Software or firmware issue",
  "Physical damage",
  "Missing parts or accessories",
  "Safety hazard",
  "Unusual noise or vibration",
];

const ReportIssuePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(initialForm);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [useAssigned, setUseAssigned] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingAssets(true);
      try {
        const [assignRes, assetRes] = await Promise.all([
          axios.get(`http://localhost:3000/assignment/employee/${user?.sub}`, {
            headers,
          }),
          axios.get("http://localhost:3000/assets", { headers }),
        ]);
        if (assignRes.status === 200)
          setAssignments(
            assignRes.data.filter((a: Assignment) => a.asset !== null),
          );
        if (assetRes.status === 200) setAllAssets(assetRes.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingAssets(false);
      }
    };
    if (user?.sub) fetchData();
  }, [user?.sub]);

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setForm((prev) => ({ ...prev, assetId: asset.id }));
  };

  const assetList = useAssigned ? assignments.map((a) => a.asset) : allAssets;

  const filteredAssets = assetList.filter(
    (a) =>
      a.assetName.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.assetSerialNumber?.toLowerCase().includes(assetSearch.toLowerCase()),
  );

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

    setLoading(true);
    try {
      const payload = {
        assetId: form.assetId,
        issue: form.issue,
        severity: form.severity,
        status: "pending",
        startDate: new Date().toISOString().split("T")[0],
        notes: form.notes || null,
      };

      const res = await axios.post(
        "http://localhost:3000/maintenance",
        payload,
        { headers },
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Issue reported successfully!");
        navigate(`/user-home/${user?.sub}`);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message ?? "Failed to report issue.");
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
            onClick={() => navigate(`/user-home/${user?.sub}`)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-white/60" />
          </button>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">
              Support
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Report an Issue
            </h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center">
          <Flag size={14} className="text-red-400" strokeWidth={1.8} />
        </div>
      </div>

      <div className="px-9 py-8 max-w-3xl">
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
                  Which Asset Has an Issue?
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
              {/* Toggle: My Assets vs All Assets */}
              <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg w-fit mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setUseAssigned(true);
                    setSelectedAsset(null);
                    setForm((prev) => ({ ...prev, assetId: "" }));
                    setAssetSearch("");
                  }}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    useAssigned
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  My Assigned Assets
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUseAssigned(false);
                    setSelectedAsset(null);
                    setForm((prev) => ({ ...prev, assetId: "" }));
                    setAssetSearch("");
                  }}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    !useAssigned
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  All Assets
                </button>
              </div>

              {/* Search */}
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

              {/* Asset List */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {loadingAssets ? (
                  <p className="text-xs text-white/25 text-center py-4">
                    Loading assets...
                  </p>
                ) : filteredAssets.length === 0 ? (
                  <p className="text-xs text-white/25 text-center py-4">
                    {useAssigned
                      ? "No assigned assets found"
                      : "No assets found"}
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

          {/* Issue Description */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <AlertTriangle
                size={13}
                className="text-red-400"
                strokeWidth={1.8}
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Describe the Issue
              </span>
            </div>
            <div className="p-6 space-y-5">
              {/* Common Issues */}
              <div>
                <label className={labelClass}>Common Issues</label>
                <div className="flex flex-wrap gap-2">
                  {commonIssues.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => set("issue")(issue)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                        form.issue === issue
                          ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                          : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
                      }`}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Description */}
              <div>
                <label className={labelClass}>Issue Description *</label>
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-4 top-3.5 text-white/25 pointer-events-none"
                  />
                  <textarea
                    rows={4}
                    value={form.issue}
                    onChange={(e) => set("issue")(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className={`${inputClass} pl-10 resize-none leading-relaxed`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Severity */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Flag size={13} className="text-violet-400" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                How Severe Is the Issue?
              </span>
            </div>
            <div className="p-6 grid grid-cols-3 gap-3">
              {(
                Object.entries(severityConfig) as [
                  "low" | "medium" | "high",
                  (typeof severityConfig)[keyof typeof severityConfig],
                ][]
              ).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("severity")(key)}
                  className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all cursor-pointer ${
                    form.severity === key
                      ? `${config.bg} ${config.border}`
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      form.severity === key ? config.dot : "bg-white/10"
                    }`}
                  />
                  <p
                    className={`text-sm font-semibold ${
                      form.severity === key ? config.color : "text-white/40"
                    }`}
                  >
                    {config.label}
                  </p>
                  <p className="text-[11px] text-white/25 text-center">
                    {config.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <FileText size={13} className="text-white/40" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Additional Notes
              </span>
              <span className="text-[10px] text-white/20 ml-1">(optional)</span>
            </div>
            <div className="p-6">
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                placeholder="Any other details that might help resolve this issue..."
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </div>
          </div>

          {/* Summary */}
          {selectedAsset && form.issue && (
            <div className="bg-red-400/5 border border-red-400/15 rounded-xl p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-red-400/60 mb-3">
                Report Summary
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="px-3 py-2.5 bg-white/[0.03] rounded-lg">
                  <p className="text-[10px] text-white/25 mb-1">Asset</p>
                  <p className="text-xs font-medium text-white/70 truncate">
                    {selectedAsset.assetName}
                  </p>
                </div>
                <div className="px-3 py-2.5 bg-white/[0.03] rounded-lg">
                  <p className="text-[10px] text-white/25 mb-1">Severity</p>
                  <p
                    className={`text-xs font-medium capitalize ${severityConfig[form.severity].color}`}
                  >
                    {form.severity}
                  </p>
                </div>
                <div className="px-3 py-2.5 bg-white/[0.03] rounded-lg">
                  <p className="text-[10px] text-white/25 mb-1">Status</p>
                  <p className="text-xs font-medium text-amber-400">Pending</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setSelectedAsset(null);
                setAssetSearch("");
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={13} /> Clear
            </button>
            <button
              type="submit"
              disabled={loading || !form.assetId || !form.issue}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Flag size={13} />
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssuePage;
