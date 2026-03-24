import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Users,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  PencilLine,
  ChevronDown,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  lastLoginAt?: string;
  createdAt: string;
}

const roles = ["All", "admin", "employee"];
const departments = [
  "All",
  "Engineering",
  "Workshop A",
  "Workshop B",
  "HR",
  "Finance",
  "Operations",
  "IT",
];

const roleStyle = (role: string) => {
  if (role === "admin")
    return "text-amber-400 bg-amber-400/10 border border-amber-400/20";
  return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
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

const EmployeesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/users", { headers });
      if (res.status === 200) setEmployees(res.data);
    } catch (error) {
      toast.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:3000/users/${id}`, { headers });
      toast.success("Employee deleted.");
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch {
      toast.error("Failed to delete employee.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = employees.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department?.toLowerCase().includes(search.toLowerCase());
    const matchRole = selectedRole === "All" || e.role === selectedRole;
    const matchDept =
      selectedDepartment === "All" || e.department === selectedDepartment;
    return matchSearch && matchRole && matchDept;
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
              People
            </p>
            <h1 className="text-xl font-semibold tracking-tight">Employees</h1>
          </div>
        </div>
        <button
          onClick={() => navigate(`/user-home/${user?.sub}/add-employee`)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
        >
          <Plus size={13} /> Add Employee
        </button>
      </div>

      <div className="px-9 py-7">
        {/* Summary Pills */}
        <div className="flex items-center gap-3 mb-6">
          {[
            { label: "Total", value: employees.length, color: "text-white/60" },
            {
              label: "Admins",
              value: employees.filter((e) => e.role === "admin").length,
              color: "text-amber-400",
            },
            {
              label: "Employees",
              value: employees.filter((e) => e.role === "employee").length,
              color: "text-teal-400",
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
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              type="text"
              placeholder="Search by name, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-all"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Shield
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-lg pl-8 pr-8 py-2 text-xs text-white/60 outline-none appearance-none cursor-pointer focus:border-amber-400/40 transition-all"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="bg-[#0f1117]">
                  {r === "All" ? "All Roles" : r}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 pr-8 py-2 text-xs text-white/60 outline-none appearance-none cursor-pointer focus:border-amber-400/40 transition-all"
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-[#0f1117]">
                  {d === "All" ? "All Departments" : d}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
            />
          </div>

          <span className="text-[11px] text-white/25 ml-auto">
            {filtered.length} {filtered.length === 1 ? "employee" : "employees"}
          </span>
        </div>

        {/* Table */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  "Employee",
                  "Email",
                  "Phone",
                  "Department",
                  "Role",
                  "Last Login",
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
                    colSpan={7}
                    className="px-5 py-12 text-center text-xs text-white/25"
                  >
                    Loading employees...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users
                        size={24}
                        className="text-white/10"
                        strokeWidth={1.5}
                      />
                      <p className="text-xs text-white/25">
                        No employees found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((emp, i) => (
                  <tr
                    key={emp.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Avatar + Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}
                        >
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-[10px] text-white/25">
                            ID: {emp.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Mail size={11} className="text-white/20" />
                        <span className="text-xs text-white/40">
                          {emp.email}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Phone size={11} className="text-white/20" />
                        <span className="text-xs text-white/40">
                          {emp.phone || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3.5 text-xs text-white/40">
                      {emp.department || "—"}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${roleStyle(emp.role)}`}
                      >
                        {emp.role}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="px-5 py-3.5 text-xs text-white/30">
                      {emp.lastLoginAt
                        ? new Date(emp.lastLoginAt).toLocaleDateString(
                            "en-ZA",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "Never"}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            navigate(
                              `/user-home/${user?.sub}/edit-employee/${emp.id}`,
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <PencilLine size={12} className="text-white/50" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/user-home/${user?.sub}/delete-employee/${emp.id}`,
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

export default EmployeesPage;
