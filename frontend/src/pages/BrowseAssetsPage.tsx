import { useEffect, useState, type ElementType } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Package,
  ArrowLeft,
  Search,
  ChevronDown,
  Filter,
  Monitor,
  Wrench,
  HardHat,
  Sofa,
  Car,
  Factory,
} from "lucide-react";
import axios from "axios";

interface Asset {
  id: string;
  assetName: string;
  assetSerialNumber?: string;
  category: string;
  status: string;
  condition: string;
  department?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  additionalNotes?: string;
}

const categories = [
  "All",
  "IT Equipment",
  "Power Tools",
  "Safety Gear",
  "Office Furniture",
  "Vehicles",
  "Machinery",
  "Other",
];

const statuses = ["All", "Available", "In Use", "Maintenance", "Retired"];

const statusStyle = (status: string) => {
  if (status === "Available")
    return "text-violet-400 bg-violet-400/10 border border-violet-400/20";
  if (status === "In Use")
    return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
  if (status === "Maintenance")
    return "text-red-400 bg-red-400/10 border border-red-400/20";
  return "text-white/30 bg-white/5 border border-white/10";
};

const conditionStyle = (c: string) => {
  if (c === "New") return "text-teal-400";
  if (c === "Good") return "text-violet-400";
  if (c === "Fair") return "text-amber-400";
  return "text-red-400";
};

interface CategoryConfig {
  icon: ElementType;
  bg: string;
  color: string;
}

const categoryConfig: Record<string, CategoryConfig> = {
  "IT Equipment": {
    icon: Monitor,
    bg: "bg-teal-400/10",
    color: "text-teal-400",
  },
  "Power Tools": {
    icon: Wrench,
    bg: "bg-amber-400/10",
    color: "text-amber-400",
  },
  "Safety Gear": {
    icon: HardHat,
    bg: "bg-violet-400/10",
    color: "text-violet-400",
  },
  "Office Furniture": {
    icon: Sofa,
    bg: "bg-blue-400/10",
    color: "text-blue-400",
  },
  Vehicles: { icon: Car, bg: "bg-pink-400/10", color: "text-pink-400" },
  Machinery: {
    icon: Factory,
    bg: "bg-orange-400/10",
    color: "text-orange-400",
  },
  Other: { icon: Package, bg: "bg-white/5", color: "text-white/40" },
};

const defaultConfig: CategoryConfig = {
  icon: Package,
  bg: "bg-white/5",
  color: "text-white/40",
};

const BrowseAssetsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [expanded, setExpanded] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/assets", {
          headers,
        });
        if (res.status === 200) setAssets(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filtered = assets.filter((a) => {
    const matchSearch =
      a.assetName.toLowerCase().includes(search.toLowerCase()) ||
      a.assetSerialNumber?.toLowerCase().includes(search.toLowerCase()) ||
      a.department?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || a.category === selectedCategory;
    const matchStatus = selectedStatus === "All" || a.status === selectedStatus;
    return matchSearch && matchCategory && matchStatus;
  });

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
              Assets
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Browse Assets
            </h1>
          </div>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              view === "grid"
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              view === "table"
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      <div className="px-9 py-7">
        {/* Summary Pills */}
        <div className="flex items-center gap-3 mb-6">
          {[
            { label: "Total", value: assets.length, color: "text-white/60" },
            {
              label: "Available",
              value: assets.filter((a) => a.status === "Available").length,
              color: "text-violet-400",
            },
            {
              label: "In Use",
              value: assets.filter((a) => a.status === "In Use").length,
              color: "text-teal-400",
            },
            {
              label: "Maintenance",
              value: assets.filter((a) => a.status === "Maintenance").length,
              color: "text-red-400",
            },
          ].map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg"
            >
              <span className="text-[11px] text-white/30">{pill.label}</span>
              <span className={`text-xs font-semibold ${pill.color}`}>
                {pill.value}
              </span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              type="text"
              placeholder="Search by name, serial, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-all"
            />
          </div>

          <div className="relative">
            <Filter
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-lg pl-8 pr-8 py-2 text-xs text-white/60 outline-none appearance-none cursor-pointer focus:border-amber-400/40 transition-all"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0f1117]">
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 pr-8 py-2 text-xs text-white/60 outline-none appearance-none cursor-pointer focus:border-amber-400/40 transition-all"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-[#0f1117]">
                  {s === "All" ? "All Statuses" : s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
          </div>

          <span className="text-[11px] text-white/25 ml-auto">
            {filtered.length} {filtered.length === 1 ? "asset" : "assets"}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-xs text-white/25">Loading assets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Package size={20} className="text-white/10" strokeWidth={1.5} />
            </div>
            <p className="text-xs text-white/25">No assets found</p>
          </div>
        ) : view === "grid" ? (
          // Grid View
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((asset) => {
              const config: CategoryConfig =
                categoryConfig[asset.category] ?? defaultConfig;
              const Icon = config.icon;
              const isExpanded = expanded === asset.id;

              return (
                <div
                  key={asset.id}
                  className="bg-[#0f1117] border border-white/5 rounded-xl p-5 flex flex-col gap-4 cursor-pointer hover:border-white/10 transition-all"
                  onClick={() => setExpanded(isExpanded ? null : asset.id)}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}
                      >
                        <Icon
                          size={16}
                          className={config.color}
                          strokeWidth={1.8}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {asset.assetName}
                        </p>
                        <p className="text-[11px] text-white/30">
                          {asset.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ${statusStyle(asset.status)}`}
                    >
                      {asset.status}
                    </span>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-3 py-2 bg-white/[0.02] rounded-lg">
                      <p className="text-[10px] text-white/25 mb-0.5">
                        Condition
                      </p>
                      <p
                        className={`text-xs font-medium ${conditionStyle(asset.condition)}`}
                      >
                        {asset.condition}
                      </p>
                    </div>
                    <div className="px-3 py-2 bg-white/[0.02] rounded-lg">
                      <p className="text-[10px] text-white/25 mb-0.5">
                        Department
                      </p>
                      <p className="text-xs font-medium text-white/60 truncate">
                        {asset.department || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div
                      className="space-y-2 border-t border-white/[0.04] pt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[
                        {
                          label: "Serial No.",
                          value: asset.assetSerialNumber || "—",
                        },
                        {
                          label: "Purchase Date",
                          value: asset.purchaseDate
                            ? new Date(asset.purchaseDate).toLocaleDateString(
                                "en-ZA",
                              )
                            : "—",
                        },
                        {
                          label: "Purchase Price",
                          value: asset.purchasePrice
                            ? `R ${Number(asset.purchasePrice).toLocaleString()}`
                            : "—",
                        },
                      ].map((field) => (
                        <div
                          key={field.label}
                          className="flex items-center justify-between px-3 py-2 bg-white/[0.02] rounded-lg"
                        >
                          <span className="text-[11px] text-white/25">
                            {field.label}
                          </span>
                          <span className="text-[11px] text-white/60 font-medium">
                            {field.value}
                          </span>
                        </div>
                      ))}
                      {asset.additionalNotes && (
                        <div className="px-3 py-2 bg-white/[0.02] rounded-lg">
                          <p className="text-[10px] text-white/25 mb-0.5">
                            Notes
                          </p>
                          <p className="text-[11px] text-white/50">
                            {asset.additionalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-white/20 text-center">
                    {isExpanded ? "Click to collapse" : "Click to expand"}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          // Table View
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {[
                    "Asset Name",
                    "Serial No.",
                    "Category",
                    "Department",
                    "Condition",
                    "Status",
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
                {filtered.map((asset) => {
                  const config: CategoryConfig =
                    categoryConfig[asset.category] ?? defaultConfig;
                  const Icon = config.icon;
                  return (
                    <tr
                      key={asset.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}
                          >
                            <Icon
                              size={13}
                              className={config.color}
                              strokeWidth={1.8}
                            />
                          </div>
                          <p className="text-sm font-medium">
                            {asset.assetName}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-white/35 font-mono">
                        {asset.assetSerialNumber || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-white/40">
                        {asset.category}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-white/40">
                        {asset.department || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-medium">
                        <span className={conditionStyle(asset.condition)}>
                          {asset.condition}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusStyle(asset.status)}`}
                        >
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseAssetsPage;
