import React, { useState, useEffect } from "react";

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WrenchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const BoxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const STATS = [
  { value: "12,400+", label: "Assets Tracked" },
  { value: "98.6%", label: "Uptime" },
  { value: "340+", label: "Companies" },
  { value: "3.2s", label: "Avg. Check-in" },
];

const PERKS = [
  "No credit card required",
  "Free 14-day trial",
  "Setup in minutes",
];

const ASSET_CARDS = [
  { icon: WrenchIcon, name: "Power Drill — Bosch", id: "TL-00421", status: "In Use", statusColor: "text-amber-400 bg-amber-400/10", location: "Workshop B" },
  { icon: BoxIcon, name: "Laptop — Dell XPS 15", id: "IT-00873", status: "Available", statusColor: "text-emerald-400 bg-emerald-400/10", location: "IT Storage" },
  { icon: ShieldIcon, name: "Safety Harness", id: "SF-00156", status: "Maintenance", statusColor: "text-red-400 bg-red-400/10", location: "Site 3" },
  { icon: ZapIcon, name: "Generator — 5kW", id: "EQ-00034", status: "Available", statusColor: "text-emerald-400 bg-emerald-400/10", location: "Warehouse A" },
];

interface AssetCardProps {
  icon: React.FC;
  name: string;
  id: string;
  status: string;
  statusColor: string;
  location: string;
  delay: string;
}

const AssetCard = ({ icon: Icon, name, id, status, statusColor, location, delay }: AssetCardProps) => (
  <div
    className="flex items-center gap-3 bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 hover:border-amber-400/30 hover:bg-slate-800/80 transition-all duration-200 group"
    style={{ animationDelay: delay }}
  >
    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:border-amber-400/40 transition-colors flex-shrink-0">
      <Icon />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-200 truncate">{name}</p>
      <p className="text-xs text-slate-500">{id} · {location}</p>
    </div>
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor}`}>
      {status}
    </span>
  </div>
);

const Hero = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col">



      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 flex-1 flex flex-col lg:flex-row items-center gap-16">

        {/* LEFT — Copy */}
        <div className={`flex-1 max-w-xl transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Asset Management Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
            Every tool.
            <br />
            Every asset.
            <br />
            <span className="text-amber-400">Always found.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-md">
            Track, assign, and manage all your company's physical assets — from hand tools to heavy equipment — in one unified system. Know what you have, where it is, and who has it.
          </p>
          
          {/* Perks */}
          <div className="flex flex-wrap items-center gap-5">
            {PERKS.map((p) => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-4 h-4 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <CheckIcon />
                </span>
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Asset Cards Preview */}
        <div
          className={`flex-1 w-full max-w-md transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="relative bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5 shadow-2xl shadow-black/50 backdrop-blur-sm">

            {/* Panel Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Asset Registry</h3>
                <p className="text-xs text-slate-500">Live inventory · 4 of 12,400</p>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5">
              {ASSET_CARDS.map((card, i) => (
                <AssetCard key={card.id} {...card} delay={`${i * 80}ms`} />
              ))}
            </div>

            {/* Footer bar */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Last synced: <span className="text-slate-400">just now</span></span>
              <span className="text-xs font-medium text-amber-400 cursor-pointer hover:text-amber-300">View all assets →</span>
            </div>

            {/* Decorative corner glow */}
            <div className="absolute -top-px -right-px w-32 h-32 bg-amber-400/5 rounded-tr-2xl rounded-bl-full pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={`relative border-t border-slate-800/60 bg-slate-900/30 transition-all duration-700 delay-300 ${visible ? "opacity-100" : "opacity-0"}`}>
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
              <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;