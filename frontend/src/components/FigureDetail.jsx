import { motion, AnimatePresence } from "framer-motion";
import PixelFlag from "./PixelFlag.jsx";

export default function FigureDetail({ person }) {
  return (
    <AnimatePresence mode="wait">
      {person ? (
        <motion.div
          key={person.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pixel-panel p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <PixelFlag countryName={person.country_name} size={56} />
            <div>
              <h3 className="font-heading text-sm">{person.name}</h3>
              <p className="text-xs text-pixel-text/60 mt-1">
                {person.era_start < 0 ? `${Math.abs(person.era_start)} BC` : person.era_start}
                {" - "}
                {person.era_end == null ? "present" : person.era_end}
                {" · "}
                {person.country_name}
              </p>
            </div>
          </div>

          <p className="text-sm mb-4 leading-relaxed">{person.description}</p>

          <div className="text-xs mb-4 space-y-1.5 border-t-2 border-pixel-brown/30 pt-3">
            <div className="flex justify-between">
              <span>Global Impact</span>
              <span className="font-semibold text-pixel-gold-dark">{person.breakdown.global_impact}</span>
            </div>
            <div className="flex justify-between">
              <span>Longevity</span>
              <span className="font-semibold text-pixel-gold-dark">{person.breakdown.longevity}</span>
            </div>
            <div className="flex justify-between">
              <span>Cross-Region Impact</span>
              <span className="font-semibold text-pixel-gold-dark">{person.breakdown.cross_region_impact}</span>
            </div>
          </div>

          {person.influenced.length > 0 && (
            <div className="text-sm mb-1.5">
              <span className="font-semibold text-pixel-green-dark">Influenced: </span>
              {person.influenced.join(", ")}
            </div>
          )}
          {person.influenced_by.length > 0 && (
            <div className="text-sm">
              <span className="font-semibold text-pixel-green-dark">Influenced by: </span>
              {person.influenced_by.join(", ")}
            </div>
          )}
        </motion.div>
      ) : (
        <div className="pixel-panel-dark p-5">
          <p className="text-sm italic opacity-70">Click a figure to see details.</p>
        </div>
      )}
    </AnimatePresence>
  );
}