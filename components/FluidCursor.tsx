"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@whatisjery/react-fluid-distortion";

interface FluidCursorProps {
  /** CSS custom property name to derive the fluid color from */
  colorToken?: string;
  curl?: number;
  className?: string;
}

export default function FluidCursor({
  colorToken = "--signal-500",
  curl = 30,
  className = "",
}: FluidCursorProps) {
  // WebGL can't resolve CSS var() strings — read the computed value once mounted
  const [fluidColor, setFluidColor] = useState<string | null>(null);

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(colorToken)
      .trim();
    setFluidColor(value || "#2FD97B");
  }, [colorToken]);

  if (!fluidColor) return null;

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]}>
        <EffectComposer>
          <Fluid fluidColor={fluidColor} curl={curl} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
