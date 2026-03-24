// pages/AllAssets.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Search,
  Plus,
  Filter,
  ArrowLeft,
  Trash2,
  PencilLine,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../auth/useAuth";

interface Asset {
  id: string;
  assetName: string;
  assetSerialNumber: string;
  category: string;
  status: string;
  condition: string;
  department: string;
  purchaseDate: string;
  purchasePrice: number;
  additionalNotes: string;
  createdAt: string;
}

const statusStyle = (status: string) => {
  if (status === "In Use")
    return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
  if (status === "Maintenance")
    return "text-red-400 bg-red-400/10 border border-red-400/20";
  if (status === "Retired")
    return "text-white/30 bg-white/5 border border-white/10";
  return "text-violet-400 bg-violet-400/10 border border-violet-400/20";
};

const conditionStyle = (condition: string) => {
  if (condition === "New") return "text-teal-400";
  if (condition === "Good") return "text-violet-400";
  if (condition === "Fair") return "text-amber-400";
  return "text-red-400";
};

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

const AllAssetsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/assets", { headers });
      if (res.status === 200) setAssets(res.data);
    } catch (error) {
      toast.error("Failed to load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:3000/assets/${id}`, { headers });
      toast.success("Asset deleted.");
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Failed to delete asset.");
    } finally {
      setDeletingId(null);
    }
  };

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
              Asset Registry
            </p>
            <h1 className="text-xl font-semibold tracking-tight">All Assets</h1>
          </div>
        </div>
        <button
          onClick={() => navigate(`/user-home/${user?.sub}/add-asset`)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
        >
          <Plus size={13} /> Register Asset
        </button>
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
            {
              label: "Retired",
              value: assets.filter((a) => a.status === "Retired").length,
              color: "text-white/30",
            },
          ].map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/8 rounded-lg"
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
          {/* Search */}
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

          {/* Category Filter */}
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
                  {c}
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
                  {s}
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

        {/* Table */}
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
                  "Purchase Date",
                  "Price (R)",
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
                    colSpan={9}
                    className="px-5 py-12 text-center text-xs text-white/25"
                  >
                    Loading assets...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package
                        size={24}
                        className="text-white/10"
                        strokeWidth={1.5}
                      />
                      <p className="text-xs text-white/25">No assets found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium">
                      {asset.assetName}
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
                    <td className="px-5 py-3.5 text-xs text-white/35">
                      {asset.purchaseDate
                        ? new Date(asset.purchaseDate).toLocaleDateString(
                            "en-ZA",
                          )
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/40">
                      {asset.purchasePrice
                        ? `R ${Number(asset.purchasePrice).toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            navigate(
                              `/user-home/${user?.sub}/edit-asset/${asset.id}`,
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <PencilLine size={12} className="text-white/50" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/user-home/${user?.sub}/delete-asset/${asset.id}`,
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

export default AllAssetsPage;
