import { useEffect, useState, useMemo } from "react";
import { fetchCountries, fetchPeople, fetchPersonDetail } from "./api.js";
import WorldTree from "./components/WorldTree.jsx";
import RegionPanel from "./components/RegionPanel.jsx";
import FigureDetail from "./components/FigureDetail.jsx";
import SearchBar from "./components/SearchBar.jsx";

// Generates a fixed set of stars once per load - denser and dimmer near the
// top where the sky is darkest, sparser near the bottom.
function generateStars(count = 90) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 70, // keep stars mostly in the upper, darker portion
    left: Math.random() * 100,
    size: 1 + Math.random() * 1.8,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 3,
  }));
}

export default function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [year, setYear] = useState(2025);
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stars = useMemo(() => generateStars(), []);

  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    fetchPeople(selectedCountry.id, year)
      .then(setPeople)
      .catch((err) => setError(err.message));
  }, [selectedCountry, year]);

  function handleSelectCountry(country) {
    setSelectedCountry(country);
    setSelectedPerson(null);
  }

  function handleSelectPerson(personId) {
    fetchPersonDetail(personId)
      .then(setSelectedPerson)
      .catch((err) => setError(err.message));
  }

  function handleSearchSelect(result) {
    const country = countries.find((c) => c.id === result.country_id) || {
      id: result.country_id,
      name: result.country_name,
      continent: result.continent,
      latitude: result.latitude,
      longitude: result.longitude,
    };
    setSelectedCountry(country);
    setYear((currentYear) => Math.max(currentYear, result.era_start));
    handleSelectPerson(result.id);
  }

  return (
    <div className="min-h-screen px-8 py-6 relative">
      <div className="star-field">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="grain-overlay" />

      <div className="relative" style={{ zIndex: 2 }}>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-1">
          <h1 className="font-heading text-2xl gold-text tracking-wide">
            Historical Influence Engine
          </h1>
          <SearchBar onSelectResult={handleSearchSelect} />
        </div>
        <p className="text-sm opacity-50 mb-6 italic">
          Click a branch to explore the figures who shaped that part of the world.
        </p>

        {error && <div className="text-red-400 mb-4">{error}</div>}
        {loading && <div className="opacity-70">Loading...</div>}

        {!loading && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <WorldTree
                countries={countries}
                selectedCountry={selectedCountry}
                onSelectCountry={handleSelectCountry}
              />
            </div>

            <div className="flex flex-col gap-5">
              <RegionPanel
                selectedCountry={selectedCountry}
                year={year}
                onYearChange={setYear}
                people={people}
                selectedPersonId={selectedPerson?.id}
                onSelectPerson={handleSelectPerson}
              />

              <div>
                <h2 className="font-heading text-sm gold-text mb-2">Detail</h2>
                <FigureDetail person={selectedPerson} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}