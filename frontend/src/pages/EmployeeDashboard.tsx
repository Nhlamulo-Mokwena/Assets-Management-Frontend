// pages/EmployeeDashboard.tsx
import { useAuth } from "../auth/useAuth";
import {
  Package,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Assigned Assets",
    value: "4",
    icon: Package,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    label: "In Use",
    value: "3",
    icon: CheckCircle,
    color: "#14b8a6",
    bg: "rgba(20,184,166,0.1)",
    border: "rgba(20,184,166,0.2)",
  },
  {
    label: "Under Maintenance",
    value: "1",
    icon: Wrench,
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
  },
  {
    label: "Pending Requests",
    value: "2",
    icon: Clock,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
  },
];

const myAssets = [
  {
    name: "Dell Laptop XPS 15",
    category: "IT Equipment",
    serial: "DL-2023-0042",
    status: "In Use",
  },
  {
    name: "Safety Helmet",
    category: "Safety Gear",
    serial: "SH-0091",
    status: "In Use",
  },
  {
    name: "Power Drill Bosch",
    category: "Power Tools",
    serial: "PD-0887",
    status: "Maintenance",
  },
  {
    name: "Wireless Mouse",
    category: "IT Equipment",
    serial: "WM-1123",
    status: "In Use",
  },
];

const recentActivity = [
  {
    action: "Asset Assigned",
    detail: "Dell Laptop XPS 15 assigned to you",
    time: "2 days ago",
  },
  {
    action: "Issue Reported",
    detail: "Power Drill sent for maintenance",
    time: "5 days ago",
  },
  {
    action: "Asset Returned",
    detail: "Angle Grinder returned successfully",
    time: "1 week ago",
  },
];

const statusStyle = (status: string) => {
  if (status === "In Use")
    return {
      color: "#14b8a6",
      bg: "rgba(20,184,166,0.1)",
      border: "rgba(20,184,166,0.2)",
    };
  if (status === "Maintenance")
    return {
      color: "#f87171",
      bg: "rgba(248,113,113,0.1)",
      border: "rgba(248,113,113,0.2)",
    };
  return {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
  };
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      style={{
        marginLeft: "240px",
        minHeight: "100vh",
        background: "#0a0c10",
        fontFamily: "'DM Sans', sans-serif",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "32px 36px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#0f1117",
        }}
      >
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "13px",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {greeting},
        </p>
        <h1
          style={{
            margin: "0 0 4px",
            fontSize: "26px",
            fontWeight: "600",
            letterSpacing: "-0.5px",
            color: "#fff",
          }}
        >
          {user?.firstname} {user?.lastname}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Here's an overview of your assigned assets
        </p>
      </div>

      <div style={{ padding: "28px 36px" }}>
        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  borderRadius: "12px",
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <Icon size={17} color={stat.color} strokeWidth={1.8} />
                </div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "26px",
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "20px",
          }}
        >
          {/* My Assets table */}
          <div
            style={{
              background: "#0f1117",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <ClipboardList size={15} color="#f59e0b" strokeWidth={1.8} />
                <span style={{ fontSize: "13px", fontWeight: "500" }}>
                  My Assets
                </span>
              </div>
              <button
                onClick={() =>
                  navigate(`/user-home/${user?.sub}/browse-assets`)
                }
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#f59e0b",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Asset", "Category", "Serial No.", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 20px",
                        textAlign: "left",
                        fontSize: "10px",
                        fontWeight: "600",
                        letterSpacing: "0.6px",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.25)",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myAssets.map((asset, i) => {
                  const s = statusStyle(asset.status);
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {asset.name}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {asset.category}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.35)",
                          fontFamily: "monospace",
                        }}
                      >
                        {asset.serial}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "500",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            background: s.bg,
                            border: `1px solid ${s.border}`,
                            color: s.color,
                          }}
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

          {/* Right column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Report issue CTA */}
            <div
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <AlertTriangle size={15} color="#f87171" strokeWidth={1.8} />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#f87171",
                  }}
                >
                  Have an issue?
                </span>
              </div>
              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: "1.6",
                }}
              >
                Report a faulty or damaged asset for maintenance review.
              </p>
              <button
                onClick={() => navigate(`/user-home/${user?.sub}/report-issue`)}
                style={{
                  width: "100%",
                  padding: "9px",
                  background: "rgba(248,113,113,0.15)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  borderRadius: "8px",
                  color: "#f87171",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                Report an Issue <ArrowRight size={12} />
              </button>
            </div>

            {/* Recent activity */}
            <div
              style={{
                background: "#0f1117",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Clock size={14} color="#a78bfa" strokeWidth={1.8} />
                <span style={{ fontSize: "13px", fontWeight: "500" }}>
                  Recent Activity
                </span>
              </div>
              <div style={{ padding: "8px 0" }}>
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 18px",
                      borderBottom:
                        i < recentActivity.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#fff",
                      }}
                    >
                      {item.action}
                    </p>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.35)",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.detail}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
