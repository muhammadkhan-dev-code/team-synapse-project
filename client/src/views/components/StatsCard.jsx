export default function StatsCard({ label, value, subtitle, color = 'navy' }) {
  const colorMap = {
    navy: 'bg-[#0A1F44] text-white',
    blue: 'bg-[#2563EB] text-white',
    teal: 'bg-[#14B8A6] text-white',
    white: 'bg-white text-[#0A1F44] border border-slate-200',
  };

  return (
    <div className={`rounded-2xl p-6 ${colorMap[color]} shadow-sm`}>
      <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${
        color === 'white' ? 'text-slate-500' : 'text-white/60'
      }`}>
        {label}
      </p>
      <p className="text-4xl font-extrabold leading-none tracking-tight">{value}</p>
      {subtitle && (
        <p className={`text-sm mt-2 ${color === 'white' ? 'text-slate-500' : 'text-white/70'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
