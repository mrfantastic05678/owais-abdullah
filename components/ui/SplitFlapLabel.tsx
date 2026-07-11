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
    <span className={`split-flap ${className}`}>
      <span className="face face-a">{primary}</span>
      <span className="face face-b">{secondary}</span>
    </span>
  );
}
