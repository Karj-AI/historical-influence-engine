import { motion, AnimatePresence } from "framer-motion";
import FigureCard from "./FigureCard.jsx";
import TimeSlider from "./TimeSlider.jsx";

export default function RegionPanel({
  selectedCountry,
  year,
  onYearChange,
  people,
  selectedPersonId,
  onSelectPerson,
}) {
  return (
    <AnimatePresence mode="wait">
      {selectedCountry ? (
        <motion.div
          key={selectedCountry.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="pixel-panel p-5"
        >
          <h2 className="font-heading text-xs mb-1">{selectedCountry.name}</h2>
          <p className="text-xs opacity-60 mb-3">{selectedCountry.region}</p>

          <TimeSlider year={year} onYearChange={onYearChange} />

          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            <AnimatePresence>
              {people.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FigureCard
                    person={p}
                    onSelect={onSelectPerson}
                    isSelected={selectedPersonId === p.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="placeholder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pixel-panel-dark p-5"
        >
          <p className="text-sm italic opacity-70">Click a branch on the tree to explore a region.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}