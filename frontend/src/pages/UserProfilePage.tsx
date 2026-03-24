// pages/UserProfilePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  Lock,
  Camera,
  Calendar,
  Clock,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/60 focus:bg-amber-400/[0.03] transition-all duration-200";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2";

const departments = [
  "Engineering",
  "Workshop A",
  "Workshop B",
  "HR",
  "Finance",
  "Operations",
  "IT",
];

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const UserProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/users/${user?.sub}`,
          { headers },
        );
        if (res.status === 200) {
          const data = res.data;
          setProfile(data);
          setProfileForm({
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            department: data.department ?? "",
          });
        }
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setFetching(false);
      }
    };
    if (user?.sub) fetchProfile();
  }, [user?.sub]);

  const setProfile_ = (key: keyof ProfileForm) => (value: string) =>
    setProfileForm((prev) => ({ ...prev, [key]: value }));

  const setPassword_ = (key: keyof PasswordForm) => (value: string) =>
    setPasswordForm((prev) => ({ ...prev, [key]: value }));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.firstName || !profileForm.lastName || !profileForm.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await axios.patch(
        `http://localhost:3000/users/${user?.sub}`,
        {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          phone: profileForm.phone || null,
          department: profileForm.department || null,
        },
        { headers },
      );
      if (res.status === 200) {
        setProfile((prev) => (prev ? { ...prev, ...profileForm } : prev));
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message ?? "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await axios.patch(
        `http://localhost:3000/users/${user?.sub}`,
        { password: passwordForm.newPassword },
        { headers },
      );
      if (res.status === 200) {
        toast.success("Password updated successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message ?? "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (fetching) {
    return (
      <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans flex items-center justify-center">
        <p className="text-xs text-white/25">Loading profile...</p>
      </div>
    );
  }

  if (!profile) return null;

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
              Account
            </p>
            <h1 className="text-xl font-semibold tracking-tight">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="px-9 py-8 max-w-4xl">
        <div className="grid grid-cols-[280px_1fr] gap-6">
          {/* Left Column — Avatar + Info */}
          <div className="flex flex-col gap-4">
            {/* Avatar Card */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl p-6 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-amber-400/15 flex items-center justify-center text-2xl font-semibold text-amber-400">
                  {getInitials(profile.firstName, profile.lastName)}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0f1117] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                  <Camera size={11} className="text-white/40" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-[11px] text-white/35 mt-0.5">
                  {profile.email}
                </p>
              </div>
              <span
                className={`text-[11px] font-medium px-3 py-1 rounded-full capitalize ${
                  profile.role === "admin"
                    ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                    : "text-teal-400 bg-teal-400/10 border border-teal-400/20"
                }`}
              >
                {profile.role}
              </span>
            </div>

            {/* Account Details */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl p-5 flex flex-col gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                Account Details
              </p>
              {[
                {
                  icon: Shield,
                  label: "Role",
                  value: profile.role,
                  capitalize: true,
                },
                {
                  icon: MapPin,
                  label: "Department",
                  value: profile.department || "—",
                },
                {
                  icon: Calendar,
                  label: "Member Since",
                  value: formatDate(profile.createdAt),
                },
                {
                  icon: Clock,
                  label: "Last Login",
                  value: profile.lastLoginAt
                    ? formatDateTime(profile.lastLoginAt)
                    : "—",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={12} className="text-white/25" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/25 mb-0.5">
                      {item.label}
                    </p>
                    <p
                      className={`text-xs text-white/60 ${item.capitalize ? "capitalize" : ""}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Forms */}
          <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg w-fit">
              {(["profile", "security"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer capitalize ${
                    activeTab === tab
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {tab === "profile" ? "Edit Profile" : "Change Password"}
                </button>
              ))}
            </div>

            {activeTab === "profile" ? (
              // Profile Form
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <User
                      size={13}
                      className="text-teal-400"
                      strokeWidth={1.8}
                    />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                      Personal Information
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-5">
                    {/* First Name */}
                    <div>
                      <label className={labelClass}>First Name *</label>
                      <div className="relative">
                        <User
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfile_("firstName")(e.target.value)
                          }
                          placeholder="First name"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className={labelClass}>Last Name *</label>
                      <div className="relative">
                        <User
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfile_("lastName")(e.target.value)
                          }
                          placeholder="Last name"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-2">
                      <label className={labelClass}>Email Address *</label>
                      <div className="relative">
                        <Mail
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                        />
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfile_("email")(e.target.value)}
                          placeholder="Email address"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className="relative">
                        <Phone
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                        />
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfile_("phone")(e.target.value)}
                          placeholder="e.g. 071 234 5678"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label className={labelClass}>Department</label>
                      <div className="relative">
                        <MapPin
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                        />
                        <select
                          value={profileForm.department}
                          onChange={(e) =>
                            setProfile_("department")(e.target.value)
                          }
                          className={`${inputClass} pl-10 pr-10 appearance-none cursor-pointer`}
                        >
                          <option value="" className="bg-[#0f1117]">
                            Select department
                          </option>
                          {departments.map((d) => (
                            <option key={d} value={d} className="bg-[#0f1117]">
                              {d}
                            </option>
                          ))}
                        </select>
                        <ArrowLeft
                          size={13}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none rotate-[-90deg]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Save size={13} />
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              // Password Form
              <form onSubmit={handleSavePassword} className="space-y-5">
                <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <Lock
                      size={13}
                      className="text-violet-400"
                      strokeWidth={1.8}
                    />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                      Change Password
                    </span>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="px-4 py-3 bg-violet-400/5 border border-violet-400/15 rounded-lg">
                      <p className="text-[11px] text-white/35">
                        Choose a strong password with at least 6 characters.
                        Your current session will remain active after changing
                        your password.
                      </p>
                    </div>

                    {[
                      {
                        label: "Current Password *",
                        key: "currentPassword" as keyof PasswordForm,
                        placeholder: "Enter current password",
                      },
                      {
                        label: "New Password *",
                        key: "newPassword" as keyof PasswordForm,
                        placeholder: "Min. 6 characters",
                      },
                      {
                        label: "Confirm New Password *",
                        key: "confirmPassword" as keyof PasswordForm,
                        placeholder: "Re-enter new password",
                      },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className={labelClass}>{field.label}</label>
                        <div className="relative">
                          <Lock
                            size={14}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                          />
                          <input
                            type="password"
                            value={passwordForm[field.key]}
                            onChange={(e) =>
                              setPassword_(field.key)(e.target.value)
                            }
                            placeholder={field.placeholder}
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </div>
                    ))}

                    {passwordForm.newPassword &&
                      passwordForm.confirmPassword &&
                      passwordForm.newPassword !==
                        passwordForm.confirmPassword && (
                        <p className="text-[11px] text-red-400">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Save size={13} />
                    {savingPassword ? "Saving..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
