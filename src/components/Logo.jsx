
export default function Logo({ showText = true, textSize = 'text-lg' }) {
  if (!showText) return null
  return (
    <span className={`font-display font-bold text-[#F0F0FF] tracking-tight ${textSize}`}>
      EventSphere
    </span>
  )
}