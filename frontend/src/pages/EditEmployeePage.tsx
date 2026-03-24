import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Users,
  ArrowLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Shield,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const departments = [
  "Engineering",
  "Workshop A",
  "Workshop B",
  "HR",
  "Finance",
  "Operations",
  "IT",
];

const roles = ["employee", "admin"];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  password: string;
  confirmPassword: string;
}

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/60 focus:bg-amber-400/[0.03] transition-all duration-200";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2";

const InputField = ({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className={labelClass}>{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon size={14} className="text-white/25" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pl-10`}
      />
    </div>
  </div>
);

const SelectField = ({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) => (
  <div>
    <label className={labelClass}>{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon size={14} className="text-white/25" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pl-10 pr-10 appearance-none cursor-pointer`}
      >
        <option value="" disabled className="bg-[#0f1117]">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0f1117]">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
      />
    </div>
  </div>
);

const EditEmployeePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
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
        if (res.status === 200) {
          const e = res.data;
          setForm({
            firstName: e.firstName ?? "",
            lastName: e.lastName ?? "",
            email: e.email ?? "",
            phone: e.phone ?? "",
            role: e.role ?? "employee",
            department: e.department ?? "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch {
        toast.error("Failed to load employee.");
        navigate(`/user-home/${user?.sub}/employees`);
      } finally {
        setFetching(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password && form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string | null> = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || null,
        role: form.role,
        department: form.department || null,
      };

      // only include password if the user actually typed one
      if (form.password) {
        payload.password = form.password;
      }

      const res = await axios.patch(
        `http://localhost:3000/users/${id}`,
        payload,
        { headers },
      );
      if (res.status === 200) {
        toast.success("Employee updated successfully!");
        navigate(`/user-home/${user?.sub}/employees`);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message ?? "Failed to update employee.");
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
              Edit Employee
            </h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
          <Users size={14} className="text-teal-400" strokeWidth={1.8} />
        </div>
      </div>

      {/* Form */}
      <div className="px-9 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <User size={13} className="text-teal-400" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Personal Information
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <InputField
                label="First Name *"
                icon={User}
                placeholder="e.g. Sipho"
                value={form.firstName}
                onChange={set("firstName")}
              />
              <InputField
                label="Last Name *"
                icon={User}
                placeholder="e.g. Dlamini"
                value={form.lastName}
                onChange={set("lastName")}
              />
              <InputField
                label="Email Address *"
                icon={Mail}
                type="email"
                placeholder="e.g. sipho@company.com"
                value={form.email}
                onChange={set("email")}
              />
              <InputField
                label="Phone Number"
                icon={Phone}
                type="tel"
                placeholder="e.g. 071 234 5678"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>
          </div>

          {/* Role & Department */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Shield size={13} className="text-amber-400" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Role & Department
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <SelectField
                label="Role *"
                icon={Shield}
                value={form.role}
                onChange={set("role")}
                options={roles}
                placeholder="Select role"
              />
              <SelectField
                label="Department"
                icon={MapPin}
                value={form.department}
                onChange={set("department")}
                options={departments}
                placeholder="Select department"
              />
            </div>
          </div>

          {/* Password */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Lock size={13} className="text-violet-400" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Change Password
              </span>
            </div>
            <div className="px-6 pt-3 pb-2">
              <p className="text-[11px] text-white/25">
                Leave blank to keep the current password.
              </p>
            </div>
            <div className="p-6 pt-2 grid grid-cols-2 gap-5">
              <InputField
                label="New Password"
                icon={Lock}
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set("password")}
              />
              <InputField
                label="Confirm New Password"
                icon={Lock}
                type="password"
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
              />
            </div>
            {form.password &&
              form.confirmPassword &&
              form.password !== form.confirmPassword && (
                <div className="px-6 pb-4">
                  <p className="text-[11px] text-red-400">
                    Passwords do not match
                  </p>
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate(`/user-home/${user?.sub}/employees`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={13} /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Save size={13} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeePage;
