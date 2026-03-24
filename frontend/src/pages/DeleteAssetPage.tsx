// pages/DeleteAsset.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Trash2, ArrowLeft, AlertTriangle, Package } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface Asset {
  id: string;
  assetName: string;
  assetSerialNumber: string;
  category: string;
  status: string;
  condition: string;
  department: string;
  purchaseDate: string;
  purchasePrice: number;
}

const DeleteAssetPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/assets/${id}`, {
          headers,
        });
        if (res.status === 200) setAsset(res.data);
      } catch {
        toast.error("Failed to load asset.");
        navigate(`/user-home/${user?.sub}/all-assets`);
      } finally {
        setFetching(false);
      }
    };
    fetchAsset();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/assets/${id}`, { headers });
      toast.success("Asset deleted successfully.");
      navigate(`/user-home/${user?.sub}/all-assets`);
    } catch {
      toast.error("Failed to delete asset.");
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

  if (!asset) return null;

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
            <h1 className="text-xl font-semibold tracking-tight">
              Delete Asset
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
              Deleting this asset will permanently remove it from the registry
              along with all associated data.
            </p>
          </div>
        </div>

        {/* Asset Details */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <Package size={13} className="text-amber-400" strokeWidth={1.8} />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Asset to be deleted
            </span>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {[
              { label: "Asset Name", value: asset.assetName },
              { label: "Serial Number", value: asset.assetSerialNumber || "—" },
              { label: "Category", value: asset.category },
              { label: "Department", value: asset.department || "—" },
              { label: "Status", value: asset.status },
              { label: "Condition", value: asset.condition },
              {
                label: "Purchase Date",
                value: asset.purchaseDate
                  ? new Date(asset.purchaseDate).toLocaleDateString("en-ZA")
                  : "—",
              },
              {
                label: "Purchase Price",
                value: asset.purchasePrice
                  ? `R ${Number(asset.purchasePrice).toLocaleString()}`
                  : "—",
              },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-1">
                  {field.label}
                </p>
                <p className="text-sm text-white/70">{field.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/user-home/${user?.sub}/all-assets`)}
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

export default DeleteAssetPage;
