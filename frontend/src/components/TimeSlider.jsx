export default function TimeSlider({ year, onYearChange }) {
  return (
    <div className="mb-4">
      <label className="text-xs font-semibold">
        Year: <span className="text-pixel-gold-dark font-heading text-[10px]">{year < 0 ? `${Math.abs(year)} BC` : year}</span>
      </label>
      <input
        type="range"
        min={-3000}
        max={2025}
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="w-full accent-pixel-gold mt-1.5"
      />
    </div>
  );
}