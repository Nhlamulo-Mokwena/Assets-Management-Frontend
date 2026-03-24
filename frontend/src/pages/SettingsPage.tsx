import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Settings,
  ArrowLeft,
  Bell,
  Shield,
  Database,
  Palette,
  ChevronRight,
  Save,
  Check,
  AlertTriangle,
  Trash2,
  Download,
  RefreshCw,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

type ThemeOption = "dark" | "light" | "system";
type Section = "general" | "notifications" | "security" | "data" | "appearance";

const sectionNav: {
  key: Section;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  {
    key: "general",
    label: "General",
    icon: Settings,
    desc: "System name and preferences",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
    desc: "Alert and notification rules",
  },
  {
    key: "security",
    label: "Security",
    icon: Shield,
    desc: "Access and authentication",
  },
  {
    key: "data",
    label: "Data Management",
    icon: Database,
    desc: "Export, import and reset",
  },
  {
    key: "appearance",
    label: "Appearance",
    icon: Palette,
    desc: "Theme and display options",
  },
];

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/60 focus:bg-amber-400/[0.03] transition-all duration-200";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2";

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

const Toggle = ({ enabled, onChange }: ToggleProps) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
      enabled ? "bg-amber-400" : "bg-white/10"
    }`}
    style={{ height: "22px" }}
  >
    <span
      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
        enabled ? "translate-x-[18px]" : "translate-x-0"
      }`}
    />
  </button>
);

const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<Section>("general");

  // General
  const [systemName, setSystemName] = useState("Asset Registry");
  const [systemEmail, setSystemEmail] = useState("");
  const [timezone, setTimezone] = useState("Africa/Johannesburg");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [currency, setCurrency] = useState("ZAR");
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Notifications
  const [notifyNewAssignment, setNotifyNewAssignment] = useState(true);
  const [notifyAssetReturn, setNotifyAssetReturn] = useState(true);
  const [notifyMaintenance, setNotifyMaintenance] = useState(true);
  const [notifyNewEmployee, setNotifyNewEmployee] = useState(false);
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [overdueThreshold, setOverdueThreshold] = useState("7");
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Security
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [requireStrongPassword, setRequireStrongPassword] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [allowSelfRegister, setAllowSelfRegister] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Appearance
  const [theme, setTheme] = useState<ThemeOption>("dark");
  const [compactMode, setCompactMode] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);

  // Data
  const [exportLoading, setExportLoading] = useState(false);
  const [resetConfirm, setResetConfirm] = useState("");

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("General settings saved.");
    setSavingGeneral(false);
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifications(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Notification preferences saved.");
    setSavingNotifications(false);
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSecurity(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Security settings saved.");
    setSavingSecurity(false);
  };

  const handleExport = async (type: "assets" | "employees" | "assignments") => {
    setExportLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/${type}`, {
        headers,
      });
      if (res.status === 200) {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`${type} exported successfully.`);
      }
    } catch {
      toast.error(`Failed to export ${type}.`);
    } finally {
      setExportLoading(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <form onSubmit={handleSaveGeneral} className="space-y-5">
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Settings
                  size={13}
                  className="text-amber-400"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  System Settings
                </span>
              </div>
              <div className="p-6 grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className={labelClass}>System Name</label>
                  <input
                    type="text"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    placeholder="e.g. Asset Registry"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>System Email</label>
                  <input
                    type="email"
                    value={systemEmail}
                    onChange={(e) => setSystemEmail(e.target.value)}
                    placeholder="e.g. admin@company.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {[
                      "Africa/Johannesburg",
                      "UTC",
                      "Africa/Lagos",
                      "Africa/Nairobi",
                      "Europe/London",
                      "America/New_York",
                    ].map((tz) => (
                      <option key={tz} value={tz} className="bg-[#0f1117]">
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((f) => (
                      <option key={f} value={f} className="bg-[#0f1117]">
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {["ZAR", "USD", "EUR", "GBP", "KES", "NGN"].map((c) => (
                      <option key={c} value={c} className="bg-[#0f1117]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingGeneral}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Save size={13} />
                {savingGeneral ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        );

      case "notifications":
        return (
          <form onSubmit={handleSaveNotifications} className="space-y-5">
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Bell size={13} className="text-teal-400" strokeWidth={1.8} />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Alert Preferences
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {[
                  {
                    label: "New Assignment",
                    desc: "Alert when an asset is assigned to an employee",
                    value: notifyNewAssignment,
                    onChange: setNotifyNewAssignment,
                  },
                  {
                    label: "Asset Returned",
                    desc: "Alert when an employee returns an asset",
                    value: notifyAssetReturn,
                    onChange: setNotifyAssetReturn,
                  },
                  {
                    label: "Maintenance Logged",
                    desc: "Alert when a maintenance issue is reported",
                    value: notifyMaintenance,
                    onChange: setNotifyMaintenance,
                  },
                  {
                    label: "New Employee Added",
                    desc: "Alert when a new employee is registered",
                    value: notifyNewEmployee,
                    onChange: setNotifyNewEmployee,
                  },
                  {
                    label: "Overdue Assignments",
                    desc: "Alert when assignments exceed the threshold",
                    value: notifyOverdue,
                    onChange: setNotifyOverdue,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-[11px] text-white/35 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <Toggle enabled={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </div>

            {notifyOverdue && (
              <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Overdue Threshold
                  </span>
                </div>
                <div className="p-6">
                  <label className={labelClass}>
                    Days before marking overdue
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={overdueThreshold}
                      onChange={(e) => setOverdueThreshold(e.target.value)}
                      min="1"
                      max="365"
                      className={`${inputClass} max-w-[120px]`}
                    />
                    <span className="text-xs text-white/35">days</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingNotifications}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Save size={13} />
                {savingNotifications ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        );

      case "security":
        return (
          <form onSubmit={handleSaveSecurity} className="space-y-5">
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Shield
                  size={13}
                  className="text-violet-400"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Access Control
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {[
                  {
                    label: "Require Strong Passwords",
                    desc: "Enforce minimum 8 characters with mixed case and numbers",
                    value: requireStrongPassword,
                    onChange: setRequireStrongPassword,
                  },
                  {
                    label: "Two-Factor Authentication",
                    desc: "Require 2FA for all admin accounts",
                    value: twoFactorEnabled,
                    onChange: setTwoFactorEnabled,
                  },
                  {
                    label: "Allow Self Registration",
                    desc: "Let users create their own accounts",
                    value: allowSelfRegister,
                    onChange: setAllowSelfRegister,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-[11px] text-white/35 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <Toggle enabled={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Session Settings
                </span>
              </div>
              <div className="p-6">
                <label className={labelClass}>Session Timeout (minutes)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    min="5"
                    max="480"
                    className={`${inputClass} max-w-[120px]`}
                  />
                  <span className="text-xs text-white/35">
                    minutes of inactivity
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingSecurity}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Save size={13} />
                {savingSecurity ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        );

      case "data":
        return (
          <div className="space-y-5">
            {/* Export */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Download
                  size={13}
                  className="text-teal-400"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Export Data
                </span>
              </div>
              <div className="p-6 grid grid-cols-3 gap-3">
                {(["assets", "employees", "assignments"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => handleExport(type)}
                      disabled={exportLoading}
                      className="flex flex-col items-center gap-2 px-4 py-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer disabled:opacity-50 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-teal-400/10 flex items-center justify-center group-hover:bg-teal-400/15 transition-colors">
                        <Download
                          size={15}
                          className="text-teal-400"
                          strokeWidth={1.8}
                        />
                      </div>
                      <p className="text-xs font-medium capitalize">{type}</p>
                      <p className="text-[10px] text-white/25">
                        Export as JSON
                      </p>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Backup */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <RefreshCw
                  size={13}
                  className="text-violet-400"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  System Backup
                </span>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Create Full Backup</p>
                  <p className="text-[11px] text-white/35 mt-0.5">
                    Download a complete backup of all system data
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleExport("assets");
                    toast.info("Full backup initiated.");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-400/10 border border-violet-400/20 text-violet-400 text-xs font-medium rounded-lg hover:bg-violet-400/15 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} /> Backup Now
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-400/5 border border-red-400/15 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-red-400/10 flex items-center gap-2">
                <AlertTriangle
                  size={13}
                  className="text-red-400"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-red-400/60">
                  Danger Zone
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Clear All Assignments</p>
                    <p className="text-[11px] text-white/35 mt-0.5">
                      Permanently delete all assignment records
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      toast.error("This action is disabled in demo mode.")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-medium rounded-lg hover:bg-red-400/15 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                </div>
                <div className="border-t border-red-400/10 pt-4">
                  <p className="text-sm font-medium mb-2">Reset System</p>
                  <p className="text-[11px] text-white/35 mb-3">
                    Type <span className="text-red-400 font-mono">RESET</span>{" "}
                    to confirm. This will delete ALL data permanently.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={resetConfirm}
                      onChange={(e) => setResetConfirm(e.target.value)}
                      placeholder="Type RESET to confirm"
                      className={`${inputClass} max-w-xs`}
                    />
                    <button
                      disabled={resetConfirm !== "RESET"}
                      onClick={() =>
                        toast.error("Reset disabled in demo mode.")
                      }
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} /> Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-5">
            {/* Theme */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Palette
                  size={13}
                  className="text-pink-400"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Theme
                </span>
              </div>
              <div className="p-6">
                <label className={labelClass}>Color Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { key: "dark", icon: Moon, label: "Dark" },
                      { key: "light", icon: Sun, label: "Light" },
                      { key: "system", icon: Monitor, label: "System" },
                    ] as {
                      key: ThemeOption;
                      icon: React.ElementType;
                      label: string;
                    }[]
                  ).map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTheme(t.key)}
                      className={`flex flex-col items-center gap-2.5 px-4 py-4 rounded-xl border transition-all cursor-pointer ${
                        theme === t.key
                          ? "bg-amber-400/10 border-amber-400/30"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          theme === t.key ? "bg-amber-400/20" : "bg-white/5"
                        }`}
                      >
                        <t.icon
                          size={16}
                          className={
                            theme === t.key ? "text-amber-400" : "text-white/30"
                          }
                          strokeWidth={1.8}
                        />
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          theme === t.key ? "text-amber-400" : "text-white/40"
                        }`}
                      >
                        {t.label}
                      </p>
                      {theme === t.key && (
                        <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                          <Check size={9} color="#000" strokeWidth={2.5} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Display Options */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <Monitor
                  size={13}
                  className="text-blue-400"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Display Options
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {[
                  {
                    label: "Compact Mode",
                    desc: "Reduce padding and spacing throughout the UI",
                    value: compactMode,
                    onChange: setCompactMode,
                  },
                  {
                    label: "Show Animations",
                    desc: "Enable transition and motion effects",
                    value: showAnimations,
                    onChange: setShowAnimations,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-[11px] text-white/35 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <Toggle enabled={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => toast.success("Appearance settings saved.")}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <Save size={13} /> Save Appearance
              </button>
            </div>
          </div>
        );

      default:
        return null;
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
              Admin
            </p>
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <Settings size={14} className="text-white/40" strokeWidth={1.8} />
        </div>
      </div>

      <div className="px-9 py-7">
        <div className="grid grid-cols-[220px_1fr] gap-6">
          {/* Sidebar Nav */}
          <div className="flex flex-col gap-1">
            {sectionNav.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                  activeSection === item.key
                    ? "bg-amber-400/10 border border-amber-400/20"
                    : "hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeSection === item.key
                      ? "bg-amber-400/15"
                      : "bg-white/5"
                  }`}
                >
                  <item.icon
                    size={14}
                    className={
                      activeSection === item.key
                        ? "text-amber-400"
                        : "text-white/30"
                    }
                    strokeWidth={1.8}
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p
                    className={`text-xs font-medium ${
                      activeSection === item.key
                        ? "text-amber-400"
                        : "text-white/60"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-[10px] text-white/25 truncate">
                    {item.desc}
                  </p>
                </div>
                <ChevronRight
                  size={12}
                  className={
                    activeSection === item.key
                      ? "text-amber-400/50"
                      : "text-white/15"
                  }
                />
              </button>
            ))}
          </div>

          {/* Content */}
          <div>{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
