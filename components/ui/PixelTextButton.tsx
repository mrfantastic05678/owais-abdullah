"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface PixelTextButtonProps {
  label: string;
  hoverLabel: string;
  /** CSS custom property name on :root to read the text color from */
  colorToken?: string;
  fontSize?: number;
  className?: string;
}

const STEPS = [1, 5, 10, 16, 10, 5, 1];

/**
 * Pixelates the label out and back in as a new one on hover — the same
 * coarse-to-fine canvas technique driving the project thumbnail reveal
 * (PixelImage), reused here for text so the CTA and its card speak the
 * same visual language. Canvas is created lazily on first hover.
 */
export default function PixelTextButton({
  label,
  hoverLabel,
  colorToken = "--accent",
  fontSize = 15,
  className = "",
}: PixelTextButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRef = useRef(label);
  const colorRef = useRef("#3D7BFF");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduced = usePrefersReducedMotion();
  // Reserve width for whichever label is longer so the canvas never clips
  // the hover text and swapping never shifts surrounding layout
  const [minWidth, setMinWidth] = useState<number>();

  useEffect(() => {
    colorRef.current =
      getComputedStyle(document.documentElement).getPropertyValue(colorToken).trim() || colorRef.current;
  }, [colorToken]);

  useEffect(() => {
    const measure = document.createElement("canvas").getContext("2d");
    if (!measure) return;
    measure.font = `500 ${fontSize}px Satoshi, sans-serif`;
    const widest = Math.max(measure.measureText(label).width, measure.measureText(hoverLabel).width);
    setMinWidth(Math.ceil(widest) + 2);
  }, [label, hoverLabel, fontSize]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function ensureCanvas() {
    const wrap = wrapRef.current;
    if (!wrap || canvasRef.current) return canvasRef.current;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";
    wrap.appendChild(canvas);
    canvasRef.current = canvas;
    wrap.style.color = "transparent";
    return canvas;
  }

  function draw(px: number) {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = (canvas.width = wrap.offsetWidth * dpr);
    const h = (canvas.height = wrap.offsetHeight * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const fontPx = fontSize * dpr;
    if (px <= 1) {
      ctx.fillStyle = colorRef.current;
      ctx.font = `500 ${fontPx}px Satoshi, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(currentRef.current, 0, h / 2);
      return;
    }

    const off = document.createElement("canvas");
    off.width = Math.max(1, Math.floor(w / px));
    off.height = Math.max(1, Math.floor(h / px));
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.fillStyle = colorRef.current;
    octx.font = `500 ${fontPx / px}px Satoshi, sans-serif`;
    octx.textAlign = "left";
    octx.textBaseline = "middle";
    octx.fillText(currentRef.current, 0, off.height / 2);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, off.width, off.height, 0, 0, w, h);
  }

  function playSwap(nextLabel: string) {
    ensureCanvas();
    if (reduced) {
      currentRef.current = nextLabel;
      draw(1);
      return;
    }
    clearTimeout(timeoutRef.current);
    let i = 0;
    const mid = Math.floor(STEPS.length / 2);
    const step = () => {
      if (i === mid) currentRef.current = nextLabel;
      draw(STEPS[i]);
      i++;
      if (i < STEPS.length) timeoutRef.current = setTimeout(step, 30);
    };
    step();
  }

  return (
    <span
      ref={wrapRef}
      className={`relative inline-block whitespace-nowrap ${className}`}
      style={{ fontSize, minWidth }}
      onMouseEnter={() => playSwap(hoverLabel)}
      onMouseLeave={() => playSwap(label)}
    >
      {label}
    </span>
  );
}
