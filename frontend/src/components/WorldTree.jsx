import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VIEW_W = 950;
const VIEW_H = 980;
const TRUNK_X = 475;
const TRUNK_BOTTOM_Y = 780;   // where the trunk meets the soil, no gap
const TRUNK_TOP_Y = 260;

// Trunk centerline defined as a cubic bezier S-curve, matching a bonsai's
// natural twist. Sampling this same curve gives us both the tapered trunk
// shape AND the exact points along it where branches attach.
const TRUNK_CTRL = {
  p0: { x: TRUNK_X, y: TRUNK_BOTTOM_Y },
  p1: { x: TRUNK_X - 55, y: TRUNK_BOTTOM_Y - 180 },
  p2: { x: TRUNK_X + 50, y: TRUNK_BOTTOM_Y - 340 },
  p3: { x: TRUNK_X - 10, y: TRUNK_TOP_Y },
};

function cubicPoint(t, p0, p1, p2, p3) {
  const mt = 1 - t;
  const x = mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x;
  const y = mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y;
  return { x, y };
}

function cubicTangent(t, p0, p1, p2, p3) {
  const mt = 1 - t;
  const x = 3 * mt ** 2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t ** 2 * (p3.x - p2.x);
  const y = 3 * mt ** 2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t ** 2 * (p3.y - p2.y);
  const len = Math.sqrt(x * x + y * y) || 1;
  return { x: x / len, y: y / len };
}

function trunkPointAt(t) {
  return cubicPoint(t, TRUNK_CTRL.p0, TRUNK_CTRL.p1, TRUNK_CTRL.p2, TRUNK_CTRL.p3);
}
function trunkTangentAt(t) {
  return cubicTangent(t, TRUNK_CTRL.p0, TRUNK_CTRL.p1, TRUNK_CTRL.p2, TRUNK_CTRL.p3);
}

function trunkWidthAt(t) {
  // Wide at the base, tapering toward the top, with a very slight organic bulge
  return 42 * (1 - t) + 14 * t + Math.sin(t * Math.PI) * 6;
}

// Builds the tapered trunk as a proper closed polygon by sampling the
// centerline and offsetting perpendicular to the tangent at each point.
function buildTrunkPath(steps = 40) {
  const left = [];
  const right = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pt = trunkPointAt(t);
    const tan = trunkTangentAt(t);
    const nx = -tan.y;
    const ny = tan.x;
    const w = trunkWidthAt(t);
    left.push({ x: pt.x + nx * w, y: pt.y + ny * w });
    right.push({ x: pt.x - nx * w, y: pt.y - ny * w });
  }
  const path =
    "M " + left.map((p) => `${p.x} ${p.y}`).join(" L ") +
    " L " + right.reverse().map((p) => `${p.x} ${p.y}`).join(" L ") +
    " Z";
  return path;
}

// A branch curves outward from its attachment point on the trunk, ending
// higher up, built the same tapered-polygon way as the trunk.
function buildBranchPath(origin, angleDeg, length, startWidth, endWidth) {
  const angleRad = (angleDeg * Math.PI) / 180;
  const midAngleRad = ((angleDeg - 18) * Math.PI) / 180;
  const p0 = origin;
  const p1 = { x: origin.x + Math.cos(midAngleRad) * length * 0.5, y: origin.y + Math.sin(midAngleRad) * length * 0.5 };
  const p2 = { x: origin.x + Math.cos(angleRad) * length * 0.8, y: origin.y + Math.sin(angleRad) * length * 0.8 };
  const p3 = { x: origin.x + Math.cos(angleRad) * length, y: origin.y + Math.sin(angleRad) * length };

  const steps = 16;
  const left = [];
  const right = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pt = cubicPoint(t, p0, p1, p2, p3);
    const tan = cubicTangent(t, p0, p1, p2, p3);
    const nx = -tan.y, ny = tan.x;
    const w = startWidth * (1 - t) + endWidth * t;
    left.push({ x: pt.x + nx * w, y: pt.y + ny * w });
    right.push({ x: pt.x - nx * w, y: pt.y - ny * w });
  }
  const d =
    "M " + left.map((p) => `${p.x} ${p.y}`).join(" L ") +
    " L " + right.reverse().map((p) => `${p.x} ${p.y}`).join(" L ") +
    " Z";
  return { d, tip: p3 };
}

function computeContinentLayout(continents) {
  return continents.map((name, i) => {
    const count = continents.length;
    // Distribute attachment points up the trunk, alternating left/right,
    // exactly like a real tree's branches - not all from one spot.
    const t = 0.32 + (0.6 * i) / Math.max(count - 1, 1);
    const side = i % 2 === 0 ? -1 : 1;
    const origin = trunkPointAt(t);
    const angleDeg = side * (55 + (i % 3) * 8) - 90 + side * 20;
    const length = 190 + (i % 2) * 20;
    const branch = buildBranchPath(origin, angleDeg, length, 11, 4);
    return { name, origin, angleDeg, length, path: branch.d, tip: branch.tip };
  });
}

function computeCountryLayout(continentBranch, countries) {
  const count = countries.length;
  const spreadDegrees = Math.min(140, 40 + count * 12);
  const startAngle = continentBranch.angleDeg - spreadDegrees / 2;

  return countries.map((country, i) => {
    const angleDeg = startAngle + (spreadDegrees / Math.max(count - 1, 1)) * i;
    const branch = buildBranchPath(continentBranch.tip, angleDeg, 105, 5, 2);
    return { ...country, path: branch.d, tip: branch.tip };
  });
}

// Dense, rounded, two-lobed pixel canopy - much fuller than a scatter of
// small circles, closer to an actual bonsai foliage mass.
function LeafCluster({ cx, cy, scale = 1, lit }) {
  const r = 30 * scale;
  const shadow = lit ? "#254a20" : "#1c2e19";
  const mid = lit ? "#3d7a30" : "#2e4a28";
  const bright = lit ? "#63a648" : "#456338";
  const highlight = lit ? "#8fc466" : "#5c7a4c";

  const blobs = [
    { dx: -1.1, dy: 0.1, r: 0.62, c: shadow },
    { dx: 1.1, dy: 0.15, r: 0.6, c: shadow },
    { dx: -0.55, dy: -0.35, r: 0.68, c: mid },
    { dx: 0.6, dy: -0.3, r: 0.66, c: mid },
    { dx: 0, dy: -0.5, r: 0.7, c: mid },
    { dx: -0.2, dy: -0.05, r: 0.72, c: bright },
    { dx: 0.35, dy: 0.05, r: 0.6, c: bright },
    { dx: 0, dy: -0.15, r: 0.5, c: highlight },
    { dx: -0.7, dy: -0.05, r: 0.42, c: mid },
    { dx: 0.75, dy: -0.1, r: 0.4, c: mid },
  ];

  return (
    <g style={{ transition: "opacity 0.3s ease" }}>
      {lit && <circle cx={cx} cy={cy} r={r * 2} fill="#d9ae3f" opacity="0.15" filter="url(#softGlow)" />}
      {blobs.map((b, i) => (
        <circle
          key={i}
          cx={cx + b.dx * r}
          cy={cy + b.dy * r}
          r={b.r * r}
          fill={b.c}
          stroke="#16220f"
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

export default function WorldTree({ countries, selectedCountry, onSelectCountry }) {
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [hoveredBranch, setHoveredBranch] = useState(null);

  const continentNames = useMemo(
    () => [...new Set(countries.map((c) => c.continent))].sort(),
    [countries]
  );
  const continentBranches = useMemo(() => computeContinentLayout(continentNames), [continentNames]);

  const countryBranches = useMemo(() => {
    if (!selectedContinent) return [];
    const branch = continentBranches.find((b) => b.name === selectedContinent);
    const countriesInContinent = countries.filter((c) => c.continent === selectedContinent);
    return branch ? computeCountryLayout(branch, countriesInContinent) : [];
  }, [selectedContinent, continentBranches, countries]);

  function handleContinentClick(name) {
    setSelectedContinent(name === selectedContinent ? null : name);
  }

  const trunkPath = useMemo(() => buildTrunkPath(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: TRUNK_X + (Math.random() - 0.5) * 550,
        y: 120 + Math.random() * 550,
        r: 1 + Math.random() * 2,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" style={{ maxHeight: "88vh" }}>
        <defs>
          <linearGradient id="barkGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#241a10" />
            <stop offset="22%" stopColor="#4a3520" />
            <stop offset="48%" stopColor="#6b5232" />
            <stop offset="58%" stopColor="#7a6038" />
            <stop offset="80%" stopColor="#4a3520" />
            <stop offset="100%" stopColor="#241a10" />
          </linearGradient>
          <radialGradient id="ambientGlow" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#d9ae3f" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#d9ae3f" stopOpacity="0" />
          </radialGradient>
          <filter id="branchGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <ellipse cx={TRUNK_X} cy={TRUNK_TOP_Y + 120} rx="420" ry="380" fill="url(#ambientGlow)" />

        {particles.map((p) => (
          <circle key={p.id} cx={p.x} cy={p.y} r={p.r} fill="#e8cc6b" opacity="0.5">
            <animate attributeName="opacity" values="0.1;0.7;0.1" dur={`${p.duration}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${p.y};${p.y - 30};${p.y}`} dur={`${p.duration * 1.5}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Ground shadow */}
        <ellipse cx={TRUNK_X} cy={TRUNK_BOTTOM_Y + 58} rx="175" ry="24" fill="#000" opacity="0.35" />

        {/* Pot / base - trunk will overlap directly into this, no gap */}
        <path
          d={`M ${TRUNK_X - 150} ${TRUNK_BOTTOM_Y + 10}
              L ${TRUNK_X - 120} ${TRUNK_BOTTOM_Y + 60}
              L ${TRUNK_X + 120} ${TRUNK_BOTTOM_Y + 60}
              L ${TRUNK_X + 150} ${TRUNK_BOTTOM_Y + 10}
              Z`}
          fill="#3a352c"
          stroke="#1c1a14"
          strokeWidth="3"
        />
        <ellipse cx={TRUNK_X} cy={TRUNK_BOTTOM_Y + 10} rx="150" ry="16" fill="#4a453a" stroke="#1c1a14" strokeWidth="3" />
        {/* Soil - sits right at trunk base, trunk visually emerges from it */}
        <ellipse cx={TRUNK_X} cy={TRUNK_BOTTOM_Y + 8} rx="118" ry="11" fill="#2e2418" />

        {/* Trunk - built from the same curve used for branch attachment, so
            everything reads as one continuous, coherent tree */}
        <path d={trunkPath} fill="url(#barkGradient)" stroke="#1c140c" strokeWidth="3" />

        {/* Bark ridge texture following the trunk's own curve */}
        {[0.15, -0.3, 0.4, -0.1].map((offsetFrac, i) => (
          <path
            key={i}
            d={Array.from({ length: 12 }, (_, s) => {
              const t = s / 11;
              const pt = trunkPointAt(t);
              const tan = trunkTangentAt(t);
              const nx = -tan.y, ny = tan.x;
              const w = trunkWidthAt(t) * offsetFrac;
              const x = pt.x + nx * w, y = pt.y + ny * w;
              return `${s === 0 ? "M" : "L"} ${x} ${y}`;
            }).join(" ")}
            stroke="#1c140c"
            strokeWidth="2"
            fill="none"
            opacity="0.35"
          />
        ))}

        {/* Knots */}
        <ellipse cx={trunkPointAt(0.55).x - 10} cy={trunkPointAt(0.55).y} rx="8" ry="12" fill="#1c140c" opacity="0.45" />
        <ellipse cx={trunkPointAt(0.78).x + 8} cy={trunkPointAt(0.78).y} rx="6" ry="9" fill="#1c140c" opacity="0.4" />

        {/* Continent branches */}
        <AnimatePresence>
          {continentBranches.map((branch) => {
            const isSelected = selectedContinent === branch.name;
            const isDimmed = selectedContinent && !isSelected;
            const isHovered = hoveredBranch === branch.name;

            return (
              <motion.g
                key={branch.name}
                animate={{ opacity: isDimmed ? 0.1 : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <g
                  style={{ cursor: "pointer" }}
                  onClick={() => handleContinentClick(branch.name)}
                  onMouseEnter={() => setHoveredBranch(branch.name)}
                  onMouseLeave={() => setHoveredBranch(null)}
                >
                  <path
                    d={branch.path}
                    fill={isSelected || isHovered ? "#8a6a1f" : "url(#barkGradient)"}
                    stroke="#1c140c"
                    strokeWidth="1.5"
                    filter={isSelected || isHovered ? "url(#branchGlow)" : undefined}
                    style={{ transition: "fill 0.3s ease" }}
                  />
                  <LeafCluster cx={branch.tip.x} cy={branch.tip.y} scale={isSelected ? 1.5 : 1.2} lit={isSelected || isHovered} />
                </g>
                {!isSelected && (
                  <text
                    x={branch.tip.x}
                    y={branch.tip.y - 44}
                    textAnchor="middle"
                    fontSize="16"
                    fontFamily="'Cinzel', serif"
                    fill={isHovered ? "#f0e6c8" : "#c9b896"}
                    style={{ pointerEvents: "none", transition: "fill 0.3s ease" }}
                  >
                    {branch.name}
                  </text>
                )}
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* Country sub-branches */}
        <AnimatePresence>
          {selectedContinent &&
            countryBranches.map((branch) => {
              const isSelected = selectedCountry?.id === branch.id;
              return (
                <motion.g
                  key={branch.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <g style={{ cursor: "pointer" }} onClick={() => onSelectCountry(branch)}>
                    <path
                      d={branch.path}
                      fill={isSelected ? "#b8912a" : "#6b5232"}
                      stroke="#1c140c"
                      strokeWidth="1"
                      filter={isSelected ? "url(#branchGlow)" : undefined}
                    />
                    <LeafCluster cx={branch.tip.x} cy={branch.tip.y} scale={isSelected ? 0.8 : 0.6} lit={isSelected} />
                  </g>
                  <text
                    x={branch.tip.x}
                    y={branch.tip.y - 26}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="'EB Garamond', serif"
                    fill={isSelected ? "#f0e6c8" : "#d4c4a0"}
                    style={{ pointerEvents: "none" }}
                  >
                    {branch.name}
                  </text>
                </motion.g>
              );
            })}
        </AnimatePresence>

        {selectedContinent && (
          <text x="24" y="44" fontSize="17" fontFamily="'Cinzel', serif" fill="#d9ae3f">
            {selectedContinent}
          </text>
        )}
      </svg>
    </div>
  );
}