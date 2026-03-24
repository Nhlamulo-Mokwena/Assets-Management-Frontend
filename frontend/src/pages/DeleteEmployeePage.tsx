import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Users,
  Mail,
  Phone,
  Shield,
  MapPin,
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
  createdAt: string;
  lastLoginAt?: string;
}

const roleStyle = (role: string) => {
  if (role === "admin")
    return "text-amber-400 bg-amber-400/10 border border-amber-400/20";
  return "text-teal-400 bg-teal-400/10 border border-teal-400/20";
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const DeleteEmployeePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`, {
          headers,
        });
        if (res.status === 200) setEmployee(res.data);
      } catch {
        toast.error("Failed to load employee.");
        navigate(`/user-home/${user?.sub}/employees`);
      } finally {
        setFetching(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/users/${id}`, { headers });
      toast.success("Employee deleted successfully.");
      navigate(`/user-home/${user?.sub}/employees`);
    } catch {
      toast.error("Failed to delete employee.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans flex items-center justify-center">
        <p className="text-xs text-white/25">Loading employee...</p>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans">
      {/* Header */}
      <div className="px-9 pt-8 pb-6 border-b border-white/5 bg-[#0f1117] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/user-home/${user?.sub}/employees`)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-white/60" />
          </button>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">
              People
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Delete Employee
            </h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center">
          <Trash2 size={14} className="text-red-400" strokeWidth={1.8} />
        </div>
      </div>

      <div className="px-9 py-8 max-w-2xl">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 px-4 py-3.5 bg-red-400/5 border border-red-400/15 rounded-xl mb-6">
          <AlertTriangle
            size={15}
            className="text-red-400 shrink-0 mt-0.5"
            strokeWidth={1.8}
          />
          <div>
            <p className="text-xs font-semibold text-red-400 mb-0.5">
              This action cannot be undone
            </p>
            <p className="text-[11px] text-white/35">
              Deleting this employee will permanently remove their account and
              all associated data including assignments and activity history.
            </p>
          </div>
        </div>

        {/* Employee Card */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Users size={13} className="text-teal-400" strokeWidth={1.8} />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Employee to be deleted
            </span>
          </div>

          {/* Avatar + Name */}
          <div className="px-6 py-5 flex items-center gap-4 border-b border-white/[0.04]">
            <div className="w-12 h-12 rounded-full bg-teal-400/15 flex items-center justify-center text-sm font-semibold text-teal-400 shrink-0">
              {getInitials(employee.firstName, employee.lastName)}
            </div>
            <div>
              <p className="text-base font-semibold">
                {employee.firstName} {employee.lastName}
              </p>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${roleStyle(employee.role)}`}
              >
                {employee.role}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-2 gap-4">
            {[
              {
                icon: Mail,
                label: "Email",
                value: employee.email,
              },
              {
                icon: Phone,
                label: "Phone",
                value: employee.phone || "—",
              },
              {
                icon: MapPin,
                label: "Department",
                value: employee.department || "—",
              },
              {
                icon: Shield,
                label: "Role",
                value: employee.role,
              },
              {
                icon: Users,
                label: "Member Since",
                value: new Date(employee.createdAt).toLocaleDateString(
                  "en-ZA",
                  { day: "numeric", month: "long", year: "numeric" },
                ),
              },
              {
                icon: Users,
                label: "Last Login",
                value: employee.lastLoginAt
                  ? new Date(employee.lastLoginAt).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Never",
              },
            ].map((field) => (
              <div key={field.label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                  <field.icon size={12} className="text-white/25" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-0.5">
                    {field.label}
                  </p>
                  <p className="text-sm text-white/70 capitalize">
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/user-home/${user?.sub}/employees`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} /> Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeePage;
