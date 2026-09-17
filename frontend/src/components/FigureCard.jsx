import PixelFlag from "./PixelFlag.jsx";

export default function FigureCard({ person, onSelect, isSelected }) {
  return (
    <button
      onClick={() => onSelect(person.id)}
      className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-md border-2 transition-all duration-200 ${
        isSelected
          ? "bg-pixel-gold/20 border-pixel-gold"
          : "bg-pixel-panel-dark/40 border-pixel-brown/40 hover:border-pixel-gold/60"
      }`}
    >
      <PixelFlag countryName={person.country_name} size={32} />
      <div>
        <div className="font-semibold text-sm">{person.name}</div>
        <div className="text-xs text-pixel-text/70">
          {person.era_start < 0 ? `${Math.abs(person.era_start)} BC` : person.era_start}
          {" - "}
          {person.era_end == null ? "present" : person.era_end < 0 ? `${Math.abs(person.era_end)} BC` : person.era_end}
          {" · "}
          <span className="text-pixel-gold-dark font-semibold">{person.influence_score}</span>
        </div>
      </div>
    </button>
  );
}