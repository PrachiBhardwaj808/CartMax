const labels = [
  "Dispute autonomy",
  "Account security",
  "Liability balance",
  "Data sovereignty",
  "Transparency",
];

export function RiskRadar({ values }: { values: number[] }) {
  const point = (index: number, value: number) => {
    const angle = ((index * 72 - 90) * Math.PI) / 180;
    return [160 + Math.cos(angle) * value, 145 + Math.sin(angle) * value];
  };

  return (
    <svg
      viewBox="0 0 320 290"
      className="risk-radar"
      role="img"
      aria-label={`Contract balance: ${labels.map((label, i) => `${label} ${values[i]} out of 100`).join(", ")}`}
    >
      {[25, 50, 75, 100].map((value) => (
        <polygon
          key={value}
          points={labels.map((_, i) => point(i, value).join(",")).join(" ")}
          fill="none"
          stroke="var(--radar-grid, #E1EBE2)"
          strokeWidth="1.2"
        />
      ))}
      {labels.map((_, i) => (
        <line
          key={i}
          x1="160"
          y1="145"
          x2={point(i, 100)[0]}
          y2={point(i, 100)[1]}
          stroke="var(--radar-grid, #E1EBE2)"
          strokeWidth="1.2"
        />
      ))}
      <polygon
        points={values.map((value, i) => point(i, value).join(",")).join(" ")}
        fill="var(--radar-fill, rgba(79, 157, 105, 0.22))"
        stroke="var(--radar-accent, #4F9D69)"
        strokeWidth="2.2"
      />
      {values.map((value, i) => (
        <circle
          key={i}
          cx={point(i, value)[0]}
          cy={point(i, value)[1]}
          r="4"
          fill="var(--radar-accent, #4F9D69)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      ))}
      {labels.map((label, i) => (
        <text
          key={label}
          x={point(i, 126)[0]}
          y={point(i, 126)[1] + 4}
          textAnchor="middle"
          fill="var(--radar-label, #24352A)"
          fontSize="10.5"
          fontWeight="500"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
