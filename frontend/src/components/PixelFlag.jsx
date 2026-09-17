// Real flag color schemes, simplified into pixel stripe patterns.
// Layout: "h" = horizontal stripes, "v" = vertical stripes
const FLAGS = {
  Italy: { layout: "v", colors: ["#2e8b3d", "#f0f0f0", "#c33"] },
  Egypt: { layout: "h", colors: ["#c33", "#f0f0f0", "#222"] },
  China: { layout: "solid", colors: ["#c33"], accent: "#e8c93f" },
  Greece: { layout: "h", colors: ["#2255aa", "#f0f0f0", "#2255aa", "#f0f0f0"] },
  India: { layout: "h", colors: ["#e8822f", "#f0f0f0", "#2e8b3d"] },
  France: { layout: "v", colors: ["#2255aa", "#f0f0f0", "#c33"] },
  England: { layout: "cross", colors: ["#f0f0f0", "#c33"] },
  Spain: { layout: "h", colors: ["#c33", "#e8c93f", "#c33"], weights: [1, 2, 1] },
  Persia: { layout: "h", colors: ["#2e8b3d", "#f0f0f0", "#c33"] },
  Japan: { layout: "circle", colors: ["#f0f0f0"], accent: "#c33" },
  Mongolia: { layout: "v", colors: ["#c33", "#3a4a9c", "#c33"] },
  Russia: { layout: "h", colors: ["#f0f0f0", "#2255aa", "#c33"] },
  Germany: { layout: "h", colors: ["#222", "#c33", "#e8c93f"] },
  Turkey: { layout: "solid", colors: ["#c33"], accent: "#f0f0f0" },
  Mexico: { layout: "v", colors: ["#2e8b3d", "#f0f0f0", "#c33"] },
};

export default function PixelFlag({ countryName, size = 40 }) {
  const flag = FLAGS[countryName] || { layout: "solid", colors: ["#6b5a3a"] };
  const w = size;
  const h = size * 0.7;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 30 21"
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
    >
      <rect x="0" y="0" width="30" height="21" fill="#3a2a1a" />

      {flag.layout === "h" &&
        flag.colors.map((color, i) => {
          const n = flag.colors.length;
          const stripeH = 21 / n;
          return <rect key={i} x="1" y={1 + i * (19 / n)} width="28" height={19 / n} fill={color} />;
        })}

      {flag.layout === "v" &&
        flag.colors.map((color, i) => {
          const n = flag.colors.length;
          return <rect key={i} x={1 + i * (28 / n)} y="1" width={28 / n} height="19" fill={color} />;
        })}

      {flag.layout === "solid" && (
        <>
          <rect x="1" y="1" width="28" height="19" fill={flag.colors[0]} />
          {flag.accent && <circle cx="15" cy="10.5" r="5" fill={flag.accent} />}
        </>
      )}

      {flag.layout === "circle" && (
        <>
          <rect x="1" y="1" width="28" height="19" fill={flag.colors[0]} />
          <circle cx="15" cy="10.5" r="5.5" fill={flag.accent} />
        </>
      )}

      {flag.layout === "cross" && (
        <>
          <rect x="1" y="1" width="28" height="19" fill={flag.colors[0]} />
          <rect x="1" y="8.5" width="28" height="4" fill={flag.colors[1]} />
          <rect x="13" y="1" width="4" height="19" fill={flag.colors[1]} />
        </>
      )}
    </svg>
  );
}