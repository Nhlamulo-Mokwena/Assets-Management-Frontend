// pages/EditAsset.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Package,
  Tag,
  Hash,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  ChevronDown,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const categories = [
  "IT Equipment",
  "Power Tools",
  "Safety Gear",
  "Office Furniture",
  "Vehicles",
  "Machinery",
  "Other",
];
const conditions = ["New", "Good", "Fair", "Poor"];
const statuses = ["Available", "In Use", "Maintenance", "Retired"];
const departments = [
  "Engineering",
  "Workshop A",
  "Workshop B",
  "HR",
  "Finance",
  "Operations",
  "IT",
];

interface FormData {
  assetName: string;
  category: string;
  assetSerialNumber: string;
  status: string;
  condition: string;
  department: string;
  purchaseDate: string;
  purchasePrice: string;
  additionalNotes: string;
}

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/60 focus:bg-amber-400/[0.03] transition-all duration-200";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2";

const SelectField = ({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  icon: any;
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

const InputField = ({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  icon: any;
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

const EditAssetPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>({
    assetName: "",
    category: "",
    assetSerialNumber: "",
    status: "",
    condition: "",
    department: "",
    purchaseDate: "",
    purchasePrice: "",
    additionalNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/assets/${id}`, {
          headers,
        });
        if (res.status === 200) {
          const a = res.data;
          setForm({
            assetName: a.assetName ?? "",
            category: a.category ?? "",
            assetSerialNumber: a.assetSerialNumber ?? "",
            status: a.status ?? "",
            condition: a.condition ?? "",
            department: a.department ?? "",
            purchaseDate: a.purchaseDate
              ? new Date(a.purchaseDate).toISOString().split("T")[0]
              : "",
            purchasePrice: a.purchasePrice ? String(a.purchasePrice) : "",
            additionalNotes: a.additionalNotes ?? "",
          });
        }
      } catch {
        toast.error("Failed to load asset.");
        navigate(`/user-home/${user?.sub}/all-assets`);
      } finally {
        setFetching(false);
      }
    };
    fetchAsset();
  }, [id]);

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        purchaseDate: form.purchaseDate || null,
        purchasePrice: form.purchasePrice || null,
      };
      const res = await axios.patch(
        `http://localhost:3000/assets/${id}`,
        payload,
        { headers },
      );
      if (res.status === 200) {
        toast.success("Asset updated successfully!");
        navigate(`/user-home/${user?.sub}/all-assets`);
      }
    } catch {
      toast.error("Failed to update asset.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans flex items-center justify-center">
        <p className="text-xs text-white/25">Loading asset...</p>
      </div>
    );
  }

  return (
    <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans">
      {/* Header */}
      <div className="px-9 pt-8 pb-6 border-b border-white/5 bg-[#0f1117] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/user-home/${user?.sub}/all-assets`)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-white/60" />
          </button>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">
              Asset Registry
            </p>
            <h1 className="text-xl font-semibold tracking-tight">Edit Asset</h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <Package size={14} className="text-amber-400" strokeWidth={1.8} />
        </div>
      </div>

      {/* Form */}
      <div className="px-9 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <Package size={13} className="text-amber-400" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Basic Information
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <InputField
                  label="Asset Name"
                  icon={Tag}
                  placeholder='e.g. MacBook Pro 14"'
                  value={form.assetName}
                  onChange={set("assetName")}
                />
              </div>
              <SelectField
                label="Category"
                icon={Package}
                value={form.category}
                onChange={set("category")}
                options={categories}
                placeholder="Select category"
              />
              <InputField
                label="Serial Number"
                icon={Hash}
                placeholder="e.g. SN-2024-00123"
                value={form.assetSerialNumber}
                onChange={set("assetSerialNumber")}
              />
              <SelectField
                label="Status"
                icon={ChevronDown}
                value={form.status}
                onChange={set("status")}
                options={statuses}
                placeholder="Select status"
              />
              <SelectField
                label="Condition"
                icon={ChevronDown}
                value={form.condition}
                onChange={set("condition")}
                options={conditions}
                placeholder="Select condition"
              />
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <MapPin size={13} className="text-teal-400" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Assignment
              </span>
            </div>
            <div className="p-6">
              <SelectField
                label="Department / Location"
                icon={MapPin}
                value={form.department}
                onChange={set("department")}
                options={departments}
                placeholder="Select department"
              />
            </div>
          </div>

          {/* Purchase Details */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <DollarSign
                size={13}
                className="text-violet-400"
                strokeWidth={1.8}
              />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Purchase Details
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              <InputField
                label="Purchase Date"
                icon={Calendar}
                type="date"
                placeholder=""
                value={form.purchaseDate}
                onChange={set("purchaseDate")}
              />
              <InputField
                label="Purchase Price (R)"
                icon={DollarSign}
                type="number"
                placeholder="e.g. 15000"
                value={form.purchasePrice}
                onChange={set("purchasePrice")}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <FileText size={13} className="text-white/40" strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Notes
              </span>
            </div>
            <div className="p-6">
              <label className={labelClass}>Additional Notes</label>
              <textarea
                rows={4}
                value={form.additionalNotes}
                onChange={(e) => set("additionalNotes")(e.target.value)}
                placeholder="Any additional details about this asset..."
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate(`/user-home/${user?.sub}/all-assets`)}
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

export default EditAssetPage;
