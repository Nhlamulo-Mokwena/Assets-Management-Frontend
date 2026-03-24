import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  ArrowLeftRight,
  ArrowLeft,
  Save,
  X,
  User,
  Package,
  ChevronDown,
  Search,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
}

interface Asset {
  id: string;
  assetName: string;
  category: string;
  assetSerialNumber?: string;
  status: string;
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2";

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/60 focus:bg-amber-400/[0.03] transition-all duration-200";

const AddAssignmentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [empRes, assetRes] = await Promise.all([
          axios.get("http://localhost:3000/users", { headers }),
          axios.get("http://localhost:3000/assets", { headers }),
        ]);
        if (empRes.status === 200) setEmployees(empRes.data);
        if (assetRes.status === 200)
          setAssets(
            assetRes.data.filter((a: Asset) => a.status === "Available"),
          );
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const filteredEmployees = employees.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    return (
      fullName.includes(employeeSearch.toLowerCase()) ||
      e.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      e.department?.toLowerCase().includes(employeeSearch.toLowerCase())
    );
  });

  const filteredAssets = assets.filter((a) => {
    return (
      a.assetName.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.assetSerialNumber?.toLowerCase().includes(assetSearch.toLowerCase())
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      toast.error("Please select an employee.");
      return;
    }
    if (!selectedAsset) {
      toast.error("Please select an asset.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        employeeId: selectedEmployee.id,
        assetId: selectedAsset.id,
        notes: notes || null,
      };
      const res = await axios.post(
        "http://localhost:3000/assignment",
        payload,
        { headers },
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Assignment created successfully!");
        navigate(`/user-home/${user?.sub}/assignments`);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message ?? "Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-60 min-h-screen bg-[#0a0c10] text-white font-sans">
      {/* Header */}
      <div className="px-9 pt-8 pb-6 border-b border-white/5 bg-[#0f1117] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/user-home/${user?.sub}/assignments`)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-white/60" />
          </button>
          <div>
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-0.5">
              People
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              New Assignment
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

      <div className="px-9 py-8 max-w-4xl">
        {loadingData ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-xs text-white/25">Loading data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Employee */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={13} className="text-teal-400" strokeWidth={1.8} />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Select Employee
                  </span>
                </div>
                {selectedEmployee && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-teal-400/10 border border-teal-400/20 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-teal-400/20 flex items-center justify-center text-[9px] font-semibold text-teal-400">
                      {getInitials(
                        selectedEmployee.firstName,
                        selectedEmployee.lastName,
                      )}
                    </div>
                    <span className="text-[11px] text-teal-400 font-medium">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedEmployee(null)}
                      className="text-teal-400/50 hover:text-teal-400 transition-colors cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Employee Search */}
                <div className="relative mb-4">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />
                  <input
                    type="text"
                    placeholder="Search by name, email, department..."
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>

                {/* Employee List */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {filteredEmployees.length === 0 ? (
                    <p className="text-xs text-white/25 text-center py-4">
                      No employees found
                    </p>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                          selectedEmployee?.id === emp.id
                            ? "bg-teal-400/10 border-teal-400/30"
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${
                            selectedEmployee?.id === emp.id
                              ? "bg-teal-400/20 text-teal-400"
                              : "bg-white/5 text-white/40"
                          }`}
                        >
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-[11px] text-white/35 truncate">
                            {emp.email}
                          </p>
                        </div>
                        {emp.department && (
                          <span className="text-[10px] text-white/25 shrink-0">
                            {emp.department}
                          </span>
                        )}
                        {selectedEmployee?.id === emp.id && (
                          <div className="w-4 h-4 rounded-full bg-teal-400 flex items-center justify-center shrink-0">
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <path
                                d="M1 4L3 6L7 2"
                                stroke="#000"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Select Asset */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package
                    size={13}
                    className="text-amber-400"
                    strokeWidth={1.8}
                  />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Select Asset
                  </span>
                </div>
                {selectedAsset && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-lg">
                    <Package size={11} className="text-amber-400" />
                    <span className="text-[11px] text-amber-400 font-medium">
                      {selectedAsset.assetName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedAsset(null)}
                      className="text-amber-400/50 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Asset Search */}
                <div className="relative mb-4">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />
                  <input
                    type="text"
                    placeholder="Search by name, category, serial number..."
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>

                {/* Asset List */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {filteredAssets.length === 0 ? (
                    <p className="text-xs text-white/25 text-center py-4">
                      No available assets found
                    </p>
                  ) : (
                    filteredAssets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                          selectedAsset?.id === asset.id
                            ? "bg-amber-400/10 border-amber-400/30"
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            selectedAsset?.id === asset.id
                              ? "bg-amber-400/20"
                              : "bg-white/5"
                          }`}
                        >
                          <Package
                            size={14}
                            className={
                              selectedAsset?.id === asset.id
                                ? "text-amber-400"
                                : "text-white/25"
                            }
                            strokeWidth={1.8}
                          />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">
                            {asset.assetName}
                          </p>
                          <p className="text-[11px] text-white/35 truncate">
                            {asset.category}
                            {asset.assetSerialNumber &&
                              ` · ${asset.assetSerialNumber}`}
                          </p>
                        </div>
                        <span className="text-[10px] text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full shrink-0">
                          Available
                        </span>
                        {selectedAsset?.id === asset.id && (
                          <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <path
                                d="M1 4L3 6L7 2"
                                stroke="#000"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            {selectedEmployee && selectedAsset && (
              <div className="bg-violet-400/5 border border-violet-400/15 rounded-xl p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400/60 mb-3">
                  Assignment Summary
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2.5 flex-1">
                    <div className="w-8 h-8 rounded-full bg-teal-400/15 flex items-center justify-center text-[11px] font-semibold text-teal-400">
                      {getInitials(
                        selectedEmployee.firstName,
                        selectedEmployee.lastName,
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {selectedEmployee.department || selectedEmployee.email}
                      </p>
                    </div>
                  </div>
                  <ArrowLeftRight
                    size={14}
                    className="text-violet-400/50 shrink-0"
                  />
                  <div className="flex items-center gap-2.5 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
                      <Package
                        size={14}
                        className="text-amber-400"
                        strokeWidth={1.8}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {selectedAsset.assetName}
                      </p>
                      <p className="text-[11px] text-white/30">
                        {selectedAsset.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                <ArrowLeftRight
                  size={13}
                  className="text-white/40"
                  strokeWidth={1.8}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Notes
                </span>
                <span className="text-[10px] text-white/20 ml-1">
                  (optional)
                </span>
              </div>
              <div className="p-6">
                <label className={labelClass}>Assignment Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details about this assignment..."
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <button
                type="button"
                onClick={() => navigate(`/user-home/${user?.sub}/assignments`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={13} /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedEmployee || !selectedAsset}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Save size={13} />
                {loading ? "Creating..." : "Create Assignment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAssignmentPage;
