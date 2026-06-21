const MAP = {
  improving: { label: '↑ Improving', cls: 'bg-green-100 text-green-800' },
  stable:    { label: '→ Stable',    cls: 'bg-yellow-100 text-yellow-800' },
  declining: { label: '↓ Declining', cls: 'bg-red-100 text-red-800' },
};

export default function MoodChip({ trend }) {
  const { label, cls } = MAP[trend] || { label: trend, cls: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}
