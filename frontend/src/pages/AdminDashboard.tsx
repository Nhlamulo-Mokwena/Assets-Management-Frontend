// pages/AdminDashboard.tsx
import { useAuth } from "../auth/useAuth";
import {
  Package,
  Users,
  ArrowLeftRight,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import StatsCard from "../components/StatsCard";

interface Asset {
  id: string;
  assetName: string;
  category: string;
  status: string;
  department: string;
}

interface MaintenanceAsset {
  id: string;
  assetName: string;
  condition: string;
  additionalNotes: string;
  updatedAt: string;
}

interface AssetHealth {
  available: number;
  inUse: number;
  maintenance: number;
  retired: number;
}

interface RecentAssignment {
  id: string;
  createdAt: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  asset: {
    id: string;
    assetName: string;
  };
}

const avatarColors = [
  "bg-amber-400/15 text-amber-400",
  "bg-teal-400/15 text-teal-400",
  "bg-violet-400/15 text-violet-400",
  "bg-red-400/15 text-red-400",
];

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0)
    return `Today, ${date.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
};

const statusStyle = (status: string) => {
  if (status === "In Use")
    return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
  if (status === "Maintenance")
    return "text-red-400 bg-red-400/10 border border-red-400/20";
  return "text-violet-400 bg-violet-400/10 border border-violet-400/20";
};

const severityStyle = (s: string) => {
  if (s === "Poor")
    return "text-red-400 bg-red-400/10 border border-red-400/20";
  if (s === "Fair")
    return "text-amber-400 bg-amber-400/10 border border-amber-400/20";
  return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [totalAssets, setTotalAssets] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [totalMaintained, setTotalMaintained] = useState(0);
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [maintenanceAssets, setMaintenanceAssets] = useState<
    MaintenanceAsset[]
  >([]);
  const [assetHealth, setAssetHealth] = useState<AssetHealth | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<
    RecentAssignment[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const requests = [
        {
          url: "http://localhost:3000/assets/total-assets",
          setter: setTotalAssets,
        },
        {
          url: "http://localhost:3000/users/total-employees",
          setter: setTotalEmployees,
        },
        {
          url: "http://localhost:3000/assignment/total-assignments",
          setter: setTotalAssignments,
        },
        {
          url: "http://localhost:3000/assets/total-maintained-assets",
          setter: setTotalMaintained,
        },
      ];

      for (const { url, setter } of requests) {
        try {
          const res = await axios.get(url, { headers });
          if (res.status === 200) setter(res.data);
        } catch (error) {
          console.log(error);
        }
      }

      try {
        const res = await axios.get("http://localhost:3000/assets", {
          headers,
        });
        if (res.status === 200) setRecentAssets(res.data.slice(0, 5));
      } catch (error) {
        console.log(error);
      }

      try {
        const res = await axios.get(
          "http://localhost:3000/assets/maintenance",
          { headers },
        );
        if (res.status === 200) setMaintenanceAssets(res.data);
      } catch (error) {
        console.log(error);
      }

      try {
        const res = await axios.get("http://localhost:3000/assets/health", {
          headers,
        });
        if (res.status === 200) setAssetHealth(res.data);
      } catch (error) {
        console.log(error);
      }
      try {
        const res = await axios.get("http://localhost:3000/assignment/recent", {
          headers,
        });
        if (res.status === 200) setRecentAssignments(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "Total Assets",
      value: String(totalAssets),
      change: "+4 this month",
      up: true,
      icon: Package,
      iconColor: "text-amber-400",
      cardBg: "bg-amber-400/5",
      cardBorder: "border-amber-400/15",
      iconBg: "bg-amber-400/10",
    },
    {
      label: "Employees",
      value: String(totalEmployees),
      change: "+2 this month",
      up: true,
      icon: Users,
      iconColor: "text-teal-400",
      cardBg: "bg-teal-400/5",
      cardBorder: "border-teal-400/15",
      iconBg: "bg-teal-400/10",
    },
    {
      label: "Active Assignments",
      value: String(totalAssignments),
      change: "71% utilization",
      up: true,
      icon: ArrowLeftRight,
      iconColor: "text-violet-400",
      cardBg: "bg-violet-400/5",
      cardBorder: "border-violet-400/15",
      iconBg: "bg-violet-400/10",
    },
    {
      label: "Under Maintenance",
      value: String(totalMaintained),
      change: "3 overdue",
      up: false,
      icon: Wrench,
      iconColor: "text-red-400",
      cardBg: "bg-red-400/5",
      cardBorder: "border-red-400/15",
      iconBg: "bg-red-400/10",
    },
  ];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans">
      {/* Header */}
      <div className="px-9 pt-8 pb-6 border-b border-white/5 bg-[#0f1117] flex items-end justify-between">
        <div>
          <p className="text-xs text-white/35 mb-1">{greeting},</p>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            {user?.firstname} {user?.lastname}
          </h1>
          <p className="text-xs text-white/35">
            Here's what's happening across your asset registry
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate(`/user-home/${user?.sub}/add-asset`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
          >
            <Package size={13} /> Register Asset
          </button>
          <button
            onClick={() => navigate(`/user-home/${user?.sub}/add-employee`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-white/70 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Users size={13} /> Add Employee
          </button>
        </div>
      </div>

      <div className="px-9 py-7">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-3.5 mb-7">
          {stats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[1fr_340px] gap-5 mb-5">
          {/* Recent Assets Table */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package
                  size={14}
                  className="text-amber-400"
                  strokeWidth={1.8}
                />
                <span className="text-sm font-medium">Recent Assets</span>
              </div>
              <button
                onClick={() => navigate(`/user-home/${user?.sub}/all-assets`)}
                className="flex items-center gap-1 text-amber-400 text-xs bg-transparent border-none cursor-pointer hover:text-amber-300 transition-colors"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Asset", "Category", "Department", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-white/20 border-b border-white/[0.04]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3 text-sm font-medium">
                      {asset.assetName}
                    </td>
                    <td className="px-5 py-3 text-xs text-white/40">
                      {asset.category}
                    </td>
                    <td className="px-5 py-3 text-xs text-white/40">
                      {asset.department}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusStyle(asset.status)}`}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {/* Maintenance Alerts */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-4 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={14}
                    className="text-red-400"
                    strokeWidth={1.8}
                  />
                  <span className="text-sm font-medium">
                    Maintenance Alerts
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-red-400 bg-red-400/10 border border-red-400/20">
                  {maintenanceAssets.length} active
                </span>
              </div>
              <div>
                {maintenanceAssets.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-white/20">
                    No maintenance alerts
                  </div>
                ) : (
                  maintenanceAssets.map((asset, i) => (
                    <div
                      key={asset.id}
                      className={`px-4 py-3 flex items-start justify-between gap-2.5 ${
                        i < maintenanceAssets.length - 1
                          ? "border-b border-white/[0.04]"
                          : ""
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-0.5">
                          {asset.assetName}
                        </p>
                        <p className="text-[11px] text-white/35 mb-1.5">
                          {asset.additionalNotes || "Under maintenance"}
                        </p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${severityStyle(asset.condition)}`}
                        >
                          {asset.condition}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-white/25 text-[11px] shrink-0">
                        <Clock size={10} />
                        {Math.floor(
                          (Date.now() - new Date(asset.updatedAt).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                        d
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Asset Health */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3.5">
                <CheckCircle
                  size={14}
                  className="text-teal-400"
                  strokeWidth={1.8}
                />
                <span className="text-sm font-medium">Asset Health</span>
              </div>
              {assetHealth &&
                [
                  {
                    label: "Available",
                    value: assetHealth.available,
                    color: "bg-violet-400",
                  },
                  {
                    label: "In Use",
                    value: assetHealth.inUse,
                    color: "bg-teal-400",
                  },
                  {
                    label: "Maintenance",
                    value: assetHealth.maintenance,
                    color: "bg-red-400",
                  },
                  {
                    label: "Retired",
                    value: assetHealth.retired,
                    color: "bg-white/20",
                  },
                ].map((item) => (
                  <div key={item.label} className="mb-2.5">
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-white/40">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-white/40">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftRight
                size={14}
                className="text-violet-400"
                strokeWidth={1.8}
              />
              <span className="text-sm font-medium">Recent Assignments</span>
            </div>
            <button
              onClick={() => navigate(`/user-home/${user?.sub}/assignments`)}
              className="flex items-center gap-1 text-violet-400 text-xs bg-transparent border-none cursor-pointer hover:text-violet-300 transition-colors"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-4">
            {recentAssignments.length === 0 ? (
              <div className="col-span-4 px-5 py-8 text-center text-xs text-white/20">
                No recent assignments
              </div>
            ) : (
              recentAssignments.map((item, i) => (
                <div
                  key={item.id}
                  className={`px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                    i < recentAssignments.length - 1
                      ? "border-r border-white/[0.04]"
                      : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}
                  >
                    {getInitials(
                      item.employee.firstName,
                      item.employee.lastName,
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium truncate mb-0.5">
                      {item.employee.firstName} {item.employee.lastName}
                    </p>
                    <p className="text-[11px] text-white/35 truncate mb-0.5">
                      {item.asset.assetName}
                    </p>
                    <p className="text-[10px] text-white/20">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
