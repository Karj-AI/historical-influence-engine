import { useState, useEffect, useRef } from "react";
import { searchPeople } from "../api.js";
import PixelFlag from "./PixelFlag.jsx";

export default function SearchBar({ onSelectResult }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      searchPeople(query)
        .then((data) => {
          setResults(data);
          setOpen(true);
        })
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(result) {
    onSelectResult(result);
    setQuery(result.name);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          setFocused(true);
          results.length > 0 && setOpen(true);
        }}
        onBlur={() => setFocused(false)}
        placeholder="Search a figure..."
        className="w-full px-4 py-2.5 rounded-full outline-none text-sm transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #e8dcb8, #ddd0a5)",
          color: "#3a2a1a",
          border: `2px solid ${focused ? "#b8863a" : "rgba(107,74,47,0.4)"}`,
          boxShadow: focused ? "0 0 14px rgba(184,134,58,0.35)" : "0 3px 0 rgba(74,51,25,0.5)",
        }}
      />

      {open && results.length > 0 && (
        <div className="pixel-panel-dark absolute z-20 mt-2 w-full rounded-2xl overflow-hidden">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-pixel-gold/15 transition-colors duration-150"
            >
              <PixelFlag countryName={r.country_name} size={24} />
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs opacity-60">{r.country_name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}