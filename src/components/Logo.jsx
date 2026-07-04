/**
 * Single source of truth for the EventSphere mark.
 * Used in the Navbar and Footer so the logo never drifts between pages.
 */
export default function Logo({ size = 32, showText = true, textClassName = 'text-lg' }) {
  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoMark" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B8DF8" />
            <stop offset="1" stopColor="#7C6AE8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#logoMark)" />
        {/* orbit ring — the "Sphere" */}
        <circle cx="15" cy="18" r="6.25" stroke="white" strokeWidth="1.7" fill="none" />
        <ellipse
          cx="15" cy="18" rx="6.25" ry="2.6"
          stroke="white" strokeOpacity="0.5" strokeWidth="1.3" fill="none"
          transform="rotate(-28 15 18)"
        />
        {/* satellite dot — the "Event" */}
        <circle cx="21.5" cy="10" r="2.1" fill="white" />
      </svg>
      {showText && (
        <span className={`font-display font-bold text-text tracking-tight ${textClassName}`}>
          EventSphere
        </span>
      )}
    </>
  )
}