// components/Sidebar.tsx
import { useAuth } from "../auth/useAuth";
import { adminMenu, employeeMenu } from "../config/menuItems";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { role, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menu = role === "admin" ? adminMenu : employeeMenu;

  const handleNav = (href: string) => {
    if (href === "/logout") {
      localStorage.removeItem("access_token");
      navigate("/login");
    } else {
      navigate(href);
    }
  };

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#0f1117",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <span
            style={{
              color: "#fff",
              fontWeight: "600",
              fontSize: "15px",
              letterSpacing: "-0.2px",
            }}
          >
            AssetTrack
          </span>
        </div>
      </div>

      {/* User pill */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background:
                role === "admin"
                  ? "rgba(245,158,11,0.15)"
                  : "rgba(20,184,166,0.15)",
              border: `1px solid ${role === "admin" ? "rgba(245,158,11,0.3)" : "rgba(20,184,166,0.3)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: role === "admin" ? "#f59e0b" : "#14b8a6",
              flexShrink: 0,
            }}
          >
            {user?.firstname?.[0]?.toUpperCase() ?? "U"}
            {user?.lastname?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#fff",
                fontWeight: "500",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.firstname ?? "Firstname"} {user?.lastname ?? "Lastname"}
            </p>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: role === "admin" ? "#f59e0b" : "#14b8a6",
              }}
            >
              {role ?? "guest"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "4px 12px",
          overflowY: "auto",
        }}
      >
        {menu.map((group) => (
          <div key={group.section} style={{ marginBottom: "4px" }}>
            <p
              style={{
                margin: "16px 8px 4px",
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {group.section}
            </p>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              const isLogout = item.href === "/logout";

              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: isActive ? "500" : "400",
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: "1px",
                    transition: "all 0.15s ease",
                    color: isLogout
                      ? "rgba(248,113,113,0.75)"
                      : isActive
                        ? "#fff"
                        : "rgba(255,255,255,0.45)",
                    background: isActive
                      ? "rgba(245,158,11,0.1)"
                      : "transparent",
                    borderLeft: isActive
                      ? "2px solid #f59e0b"
                      : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = isLogout
                        ? "#f87171"
                        : "rgba(255,255,255,0.75)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = isLogout
                        ? "rgba(248,113,113,0.75)"
                        : "rgba(255,255,255,0.45)";
                    }
                  }}
                >
                  {Icon && (
                    <Icon
                      size={15}
                      strokeWidth={1.8}
                      style={{ flexShrink: 0 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: "11px",
          color: "rgba(255,255,255,0.15)",
          textAlign: "center",
        }}
      >
        AssetTrack v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
