import { useEffect, useState, type ElementType } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  Tag,
  ArrowLeft,
  Monitor,
  Wrench,
  HardHat,
  Sofa,
  Car,
  Factory,
  Package,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

interface CategoryStat {
  category: string;
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
  retired: number;
}

interface CategoryConfig {
  icon: ElementType;
  color: string;
  bg: string;
  border: string;
  iconBg: string;
  barColor: string;
}

const categoryConfig: Record<string, CategoryConfig> = {
  "IT Equipment": {
    icon: Monitor,
    color: "text-teal-400",
    bg: "bg-teal-400/5",
    border: "border-teal-400/15",
    iconBg: "bg-teal-400/10",
    barColor: "bg-teal-400",
  },
  "Power Tools": {
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-400/5",
    border: "border-amber-400/15",
    iconBg: "bg-amber-400/10",
    barColor: "bg-amber-400",
  },
  "Safety Gear": {
    icon: HardHat,
    color: "text-violet-400",
    bg: "bg-violet-400/5",
    border: "border-violet-400/15",
    iconBg: "bg-violet-400/10",
    barColor: "bg-violet-400",
  },
  "Office Furniture": {
    icon: Sofa,
    color: "text-blue-400",
    bg: "bg-blue-400/5",
    border: "border-blue-400/15",
    iconBg: "bg-blue-400/10",
    barColor: "bg-blue-400",
  },
  Vehicles: {
    icon: Car,
    color: "text-pink-400",
    bg: "bg-pink-400/5",
    border: "border-pink-400/15",
    iconBg: "bg-pink-400/10",
    barColor: "bg-pink-400",
  },
  Machinery: {
    icon: Factory,
    color: "text-orange-400",
    bg: "bg-orange-400/5",
    border: "border-orange-400/15",
    iconBg: "bg-orange-400/10",
    barColor: "bg-orange-400",
  },
  Other: {
    icon: Package,
    color: "text-white/50",
    bg: "bg-white/[0.03]",
    border: "border-white/10",
    iconBg: "bg-white/5",
    barColor: "bg-white/20",
  },
};

const statusDots = [
  { key: "available", label: "Available", color: "bg-violet-400" },
  { key: "inUse", label: "In Use", color: "bg-teal-400" },
  { key: "maintenance", label: "Maintenance", color: "bg-red-400" },
  { key: "retired", label: "Retired", color: "bg-white/20" },
];

const defaultConfig: CategoryConfig = {
  icon: Package,
  color: "text-white/50",
  bg: "bg-white/[0.03]",
  border: "border-white/10",
  iconBg: "bg-white/5",
  barColor: "bg-white/20",
};

const CategoriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/assets/categories", {
          headers,
        });
        if (res.status === 200) setCategories(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const totalAssets = categories.reduce((sum, c) => sum + c.total, 0);
  const topCategory =
    categories.length > 0
      ? categories.reduce(
          (max, c) => (c.total > max.total ? c : max),
          categories[0],
        )
      : null;

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
              Asset Registry
            </p>
            <h1 className="text-xl font-semibold tracking-tight">Categories</h1>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-violet-400/10 border border-violet-400/20 flex items-center justify-center">
          <Tag size={14} className="text-violet-400" strokeWidth={1.8} />
        </div>
      </div>

      <div className="px-9 py-7">
        {/* Summary Pills */}
        <div className="flex items-center gap-3 mb-7">
          {[
            {
              label: "Total Categories",
              value: String(categories.length),
              color: "text-white",
            },
            {
              label: "Total Assets",
              value: String(totalAssets),
              color: "text-amber-400",
            },
            {
              label: "Largest Category",
              value: topCategory?.category ?? "—",
              color: "text-teal-400",
            },
            {
              label: "Assets in Largest",
              value: String(topCategory?.total ?? 0),
              color: "text-violet-400",
            },
          ].map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-2.5 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg"
            >
              <span className="text-[11px] text-white/30">{pill.label}</span>
              <span className={`text-xs font-semibold ${pill.color}`}>
                {pill.value}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-5">
          {statusDots.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-[11px] text-white/30">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-xs text-white/25">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Tag size={24} className="text-white/10" strokeWidth={1.5} />
            <p className="text-xs text-white/25">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat) => {
              const config: CategoryConfig =
                categoryConfig[cat.category] ?? defaultConfig;
              const Icon = config.icon;
              const utilization =
                cat.total > 0 ? Math.round((cat.inUse / cat.total) * 100) : 0;

              return (
                <div
                  key={cat.category}
                  className={`${config.bg} border ${config.border} rounded-xl p-5 flex flex-col gap-4`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg ${config.iconBg} flex items-center justify-center`}
                      >
                        <Icon
                          size={16}
                          className={config.color}
                          strokeWidth={1.8}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cat.category}</p>
                        <p className="text-[11px] text-white/30">
                          {cat.total} {cat.total === 1 ? "asset" : "assets"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/user-home/${user?.sub}/all-assets?category=${encodeURIComponent(cat.category)}`,
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <ArrowRight size={12} className="text-white/40" />
                    </button>
                  </div>

                  {/* Status Breakdown */}
                  <div className="grid grid-cols-2 gap-2">
                    {statusDots.map((s) => (
                      <div
                        key={s.key}
                        className="flex items-center justify-between px-2.5 py-1.5 bg-white/[0.03] rounded-lg"
                      >
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${s.color}`}
                          />
                          <span className="text-[10px] text-white/30">
                            {s.label}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-white/60">
                          {cat[s.key as keyof CategoryStat] as number}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Utilization Bar */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-white/25">
                        Utilization
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${config.color}`}
                      >
                        {utilization}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
