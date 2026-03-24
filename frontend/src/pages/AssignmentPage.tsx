import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  ArrowLeftRight,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  ChevronDown,
  Package,
  User,
  Calendar,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface Assignment {
  id: string;
  createdAt: string;
  returnedAt?: string;
  status: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
  };
  asset: {
    id: string;
    assetName: string;
    category: string;
    assetSerialNumber?: string;
  };
}

const statuses = ["All", "Active", "Returned"];

const statusStyle = (status: string) => {
  if (status === "Active")
    return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
  if (status === "Returned")
    return "text-white/30 bg-white/5 border border-white/10";
  return "text-violet-400 bg-violet-400/10 border border-violet-400/20";
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const avatarColors = [
  "bg-amber-400/15 text-amber-400",
  "bg-teal-400/15 text-teal-400",
  "bg-violet-400/15 text-violet-400",
  "bg-red-400/15 text-red-400",
  "bg-blue-400/15 text-blue-400",
  "bg-pink-400/15 text-pink-400",
];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const AssignmentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/assignment", {
        headers,
      });
      if (res.status === 200) setAssignments(res.data);
    } catch (error) {
      toast.error("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleReturn = async (id: string) => {
    setReturningId(id);
    try {
      const res = await axios.patch(
        `http://localhost:3000/assignment/${id}/return`,
        {},
        { headers },
      );
      if (res.status === 200) {
        toast.success("Asset returned successfully.");
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: "Returned",
                  returnedAt: new Date().toISOString(),
                }
              : a,
          ),
        );
      }
    } catch {
      toast.error("Failed to return asset.");
    } finally {
      setReturningId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:3000/assignment/${id}`, {
        headers,
      });
      toast.success("Assignment deleted.");
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Failed to delete assignment.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = assignments.filter((a) => {
    const fullName =
      `${a.employee.firstName} ${a.employee.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      a.asset.assetName.toLowerCase().includes(search.toLowerCase()) ||
      a.asset.category.toLowerCase().includes(search.toLowerCase()) ||
      a.employee.department?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === "All" || a.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const active = assignments.filter((a) => a.status === "Active").length;
  const returned = assignments.filter((a) => a.status === "Returned").length;

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
              People
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Assignments
            </h1>
          </div>
        </div>
        <button
          onClick={() => navigate(`/user-home/${user?.sub}/add-assignment`)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
        >
          <Plus size={13} /> New Assignment
        </button>
      </div>

      <div className="px-9 py-7">
        {/* Summary Pills */}
        <div className="flex items-center gap-3 mb-6">
          {[
            {
              label: "Total",
              value: assignments.length,
              color: "text-white/60",
            },
            { label: "Active", value: active, color: "text-teal-400" },
            { label: "Returned", value: returned, color: "text-white/30" },
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
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              type="text"
              placeholder="Search by employee, asset, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-all"
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
            {filtered.length}{" "}
            {filtered.length === 1 ? "assignment" : "assignments"}
          </span>
        </div>

        {/* Table */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  "Employee",
                  "Asset",
                  "Category",
                  "Department",
                  "Assigned On",
                  "Returned On",
                  "Status",
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
                    colSpan={8}
                    className="px-5 py-12 text-center text-xs text-white/25"
                  >
                    Loading assignments...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ArrowLeftRight
                        size={24}
                        className="text-white/10"
                        strokeWidth={1.5}
                      />
                      <p className="text-xs text-white/25">
                        No assignments found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Employee */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}
                        >
                          {getInitials(
                            item.employee.firstName,
                            item.employee.lastName,
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium">
                            {item.employee.firstName} {item.employee.lastName}
                          </p>
                          <p className="text-[10px] text-white/25">
                            {item.employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

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
                            {item.asset.assetName}
                          </p>
                          <p className="text-[10px] text-white/25 font-mono">
                            {item.asset.assetSerialNumber || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 text-xs text-white/40">
                      {item.asset.category}
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3.5 text-xs text-white/40">
                      {item.employee.department || "—"}
                    </td>

                    {/* Assigned On */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-white/20" />
                        <span className="text-xs text-white/40">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Returned On */}
                    <td className="px-5 py-3.5 text-xs text-white/30">
                      {item.returnedAt ? formatDate(item.returnedAt) : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusStyle(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.status === "Active" && (
                          <button
                            onClick={() => handleReturn(item.id)}
                            disabled={returningId === item.id}
                            title="Mark as returned"
                            className="w-7 h-7 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center hover:bg-teal-400/20 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RotateCcw size={12} className="text-teal-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="w-7 h-7 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center hover:bg-red-400/20 transition-colors cursor-pointer disabled:opacity-50"
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

export default AssignmentsPage;
