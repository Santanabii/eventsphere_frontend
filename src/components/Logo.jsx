/**
 * The EventSphere mark. One file, used everywhere (Navbar, Footer, Login, Register)
 * so the logo can never drift out of sync between pages.
 */
export default function Logo({ size = 32, showText = true, textSize = 'text-lg' }) {
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
        <rect width="32" height="32" rx="9" fill="#7C3AED" />
        <circle cx="15" cy="18" r="6" stroke="white" strokeWidth="1.6" fill="none" />
        <circle cx="21" cy="10.5" r="2" fill="white" />
      </svg>
      {showText && (
        <span className={`font-display font-bold text-[#F0F0FF] tracking-tight ${textSize}`}>
          EventSphere
        </span>
      )}
    </>
  )
}