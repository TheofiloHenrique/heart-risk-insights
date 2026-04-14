const EcgLine = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 800 100"
    className={`w-full ${className}`}
    preserveAspectRatio="none"
  >
    <path
      d="M0,50 L100,50 L120,50 L140,20 L160,80 L180,10 L200,90 L220,50 L240,50 L350,50 L370,50 L390,20 L410,80 L430,10 L450,90 L470,50 L490,50 L600,50 L620,50 L640,20 L660,80 L680,10 L700,90 L720,50 L800,50"
      fill="none"
      stroke="hsl(var(--health-red))"
      strokeWidth="2"
      opacity="0.3"
      className="ecg-line"
    />
  </svg>
);

export default EcgLine;
