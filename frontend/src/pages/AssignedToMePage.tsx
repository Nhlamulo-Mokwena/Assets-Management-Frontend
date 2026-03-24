import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Package,
  ArrowLeft,
  Search,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeftRight,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface Assignment {
  id: string;
  createdAt: string;
  returnedAt?: string;
  status: string;
  notes?: string;
  asset: {
    id: string;
    assetName: string;
    category: string;
    assetSerialNumber?: string;
    condition: string;
    department?: string;
  };
}

const statuses = ["All", "active", "returned"];

const statusStyle = (s: string) => {
  if (s === "active")
    return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
  return "text-white/30 bg-white/5 border border-white/10";
};

const conditionStyle = (c: string) => {
  if (c === "New") return "text-teal-400";
  if (c === "Good") return "text-violet-400";
  if (c === "Fair") return "text-amber-400";
  return "text-red-400";
};

const categoryColors: Record<string, string> = {
  "IT Equipment": "bg-teal-400/10 text-teal-400",
  "Power Tools": "bg-amber-400/10 text-amber-400",
  "Safety Gear": "bg-violet-400/10 text-violet-400",
  "Office Furniture": "bg-blue-400/10 text-blue-400",
  Vehicles: "bg-pink-400/10 text-pink-400",
  Machinery: "bg-orange-400/10 text-orange-400",
  Other: "bg-white/5 text-white/40",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getDaysHeld = (createdAt: string, returnedAt?: string) => {
  const end = returnedAt ? new Date(returnedAt) : new Date();
  return Math.floor(
    (end.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );
};

const AssignedToMePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [returningId, setReturningId] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/assignment/employee/${user?.sub}`,
          { headers },
        );
        if (res.status === 200) setAssignments(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.sub) fetchAssignments();
  }, [user?.sub]);

  const handleReturn = async (assignmentId: string) => {
    setReturningId(assignmentId);
    try {
      const res = await axios.patch(
        `http://localhost:3000/assignment/${assignmentId}/return`,
        {},
        { headers },
      );
      if (res.status === 200) {
        toast.success("Asset returned successfully.");
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  status: "returned",
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

  const filtered = assignments.filter((a) => {
    const matchSearch =
      a.asset.assetName.toLowerCase().includes(search.toLowerCase()) ||
      a.asset.category.toLowerCase().includes(search.toLowerCase()) ||
      a.asset.assetSerialNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === "All" || a.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const active = assignments.filter((a) => a.status === "active").length;
  const returned = assignments.filter((a) => a.status === "returned").length;

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
              My Assets
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Assigned to Me
            </h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-violet-400/10 border border-violet-400/20 flex items-center justify-center">
          <ArrowLeftRight
            size={14}
            className="text-violet-400"
            strokeWidth={1.8}
          />
        </div>
      </div>

      <div className="px-9 py-7">
        {/* Summary Pills */}
        <div className="flex items-center gap-3 mb-6">
          {[
            {
              label: "Total Assigned",
              value: assignments.length,
              color: "text-white/60",
            },
            {
              label: "Currently Holding",
              value: active,
              color: "text-teal-400",
            },
            {
              label: "Returned",
              value: returned,
              color: "text-white/30",
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
              placeholder="Search by asset name, category, serial..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-all"
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
                  {s === "All"
                    ? "All Statuses"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
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

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-xs text-white/25">Loading your assets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Package size={20} className="text-white/10" strokeWidth={1.5} />
            </div>
            <p className="text-xs text-white/25">No assignments found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-[#0f1117] border border-white/5 rounded-xl p-5 flex flex-col gap-4"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        categoryColors[assignment.asset.category] ??
                        "bg-white/5 text-white/40"
                      }`}
                    >
                      <Package size={16} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {assignment.asset.assetName}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {assignment.asset.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${statusStyle(assignment.status)}`}
                  >
                    {assignment.status === "active" ? "Active" : "Returned"}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Serial No.",
                      value: assignment.asset.assetSerialNumber || "—",
                    },
                    {
                      label: "Condition",
                      value: assignment.asset.condition,
                      colored: true,
                    },
                    {
                      label: "Department",
                      value: assignment.asset.department || "—",
                    },
                    {
                      label: "Days Held",
                      value: `${getDaysHeld(assignment.createdAt, assignment.returnedAt)}d`,
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="px-3 py-2 bg-white/[0.02] rounded-lg"
                    >
                      <p className="text-[10px] text-white/25 mb-0.5">
                        {field.label}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          field.colored
                            ? conditionStyle(field.value)
                            : "text-white/60"
                        }`}
                      >
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {assignment.notes && (
                  <div className="px-3 py-2 bg-white/[0.02] rounded-lg">
                    <p className="text-[10px] text-white/25 mb-0.5">Notes</p>
                    <p className="text-xs text-white/50">{assignment.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-white/20" />
                    <span className="text-[11px] text-white/30">
                      Assigned {formatDate(assignment.createdAt)}
                    </span>
                  </div>

                  {assignment.status === "active" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-teal-400">
                        <Clock size={11} />
                        <span className="text-[11px] font-medium">
                          {getDaysHeld(assignment.createdAt)}d active
                        </span>
                      </div>
                      <button
                        onClick={() => handleReturn(assignment.id)}
                        disabled={returningId === assignment.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-400/10 border border-teal-400/20 text-teal-400 text-[11px] font-medium rounded-lg hover:bg-teal-400/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RotateCcw size={11} />
                        {returningId === assignment.id
                          ? "Returning..."
                          : "Return"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-white/25">
                      <CheckCircle size={11} />
                      <span className="text-[11px]">
                        Returned{" "}
                        {assignment.returnedAt
                          ? formatDate(assignment.returnedAt)
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedToMePage;
