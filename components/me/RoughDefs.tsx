/**
 * One-shot SVG <defs> block that defines the turbulence filter used by
 * every panel / narration / bubble border on /me. Mount once at the root
 * of the page; reference via filter="url(#me-rough)".
 */
export default function RoughDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter
          id="me-rough"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.4" />
        </filter>
        <filter
          id="me-rough-soft"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.4" />
        </filter>
      </defs>
    </svg>
  )
}
