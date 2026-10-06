interface SplitFlapLabelProps {
  primary: string;
  secondary: string;
  className?: string;
}

/**
 * Departure-board flip: the primary label rotates away on hover to reveal
 * a more specific secondary one. Parent element needs the Tailwind `group`
 * class. Pure CSS (see .split-flap in globals.css) — reduced motion drops
 * the 3D flip and just shows the primary label statically.
 */
export default function SplitFlapLabel({ primary, secondary, className = "" }: SplitFlapLabelProps) {
  return (
    <span className={`split-flap relative inline-grid grid-cols-1 grid-rows-1 items-center justify-center overflow-hidden align-middle px-1 ${className}`}>
      {/* Both labels rendered invisibly in the same grid cell guarantees natural width reserves whichever is wider in real pixels */}
      <span className="invisible select-none pointer-events-none opacity-0 col-start-1 row-start-1 whitespace-nowrap px-0.5" aria-hidden="true">
        {primary}
      </span>
      <span className="invisible select-none pointer-events-none opacity-0 col-start-1 row-start-1 whitespace-nowrap px-0.5" aria-hidden="true">
        {secondary}
      </span>
      <span className="face face-a absolute inset-0 flex items-center justify-center whitespace-nowrap px-0.5">{primary}</span>
      <span className="face face-b absolute inset-0 flex items-center justify-center whitespace-nowrap px-0.5">{secondary}</span>
    </span>
  );
}
