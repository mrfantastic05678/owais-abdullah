'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTransition;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uBorderColor;
  varying vec2 vUv;

  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P), Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P), Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz, iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 / 7.0, gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0); vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 / 7.0, gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1); vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x),g100=vec3(gx0.y,gy0.y,gz0.y),g010=vec3(gx0.z,gy0.z,gz0.z),g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x),g101=vec3(gx1.y,gy1.y,gz1.y),g011=vec3(gx1.z,gy1.z,gz1.z),g111=vec3(gx1.w,gy1.w,gz1.w);
    vec4 n0=taylorInvSqrt(vec4(dot(g000,g000),dot(g100,g100),dot(g010,g010),dot(g110,g110)));
    g000*=n0.x;g100*=n0.y;g010*=n0.z;g110*=n0.w;
    vec4 n1=taylorInvSqrt(vec4(dot(g001,g001),dot(g101,g101),dot(g011,g011),dot(g111,g111)));
    g001*=n1.x;g101*=n1.y;g011*=n1.z;g111*=n1.w;
    float n000=dot(g000,Pf0),n100=dot(g100,vec3(Pf1.x,Pf0.yz)),n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)),n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z)),n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z)),n011=dot(g011,vec3(Pf0.x,Pf1.yz)),n111=dot(g111,Pf1);
    vec3 f_=fade(Pf0);
    return 2.2*mix(mix(mix(n000,n100,f_.x),mix(n010,n110,f_.x),f_.y),mix(mix(n001,n101,f_.x),mix(n011,n111,f_.x),f_.y),f_.z);
  }

  void main() {
    float pixelSize = 10.0;
    vec2 grid = uResolution / pixelSize;
    vec2 pixelatedUv = floor(vUv * grid) / grid;
    float aspect = uResolution.x / uResolution.y;
    vec2 correctedUv = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;
    float maxDistance = length(vec2(aspect, 1.0)) * 0.5;
    vec2 displacedUv = correctedUv + cnoise(vec3(correctedUv * 5.0, uTime * 0.1));
    float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));
    float d = length(correctedUv - 0.5);
    float normalizedDistance = d / maxDistance;
    float radialGradient = normalizedDistance * 12.5 + (1.0 - uTransition) * 2.0 - 15.0 * uTransition;
    float rawStrength = strength + radialGradient;
    strength = clamp(rawStrength, 0.0, 1.0);
    float edge = smoothstep(0.0, 0.7, rawStrength) * smoothstep(2.5, 0.7, rawStrength);
    edge *= min(uTransition * 5.0, 1.0);
    vec3 deepMidnightColor = uBorderColor * 0.015;
    vec3 richGlowingColor = uBorderColor * 1.5;
    vec3 edgeColor = mix(deepMidnightColor, richGlowingColor, sin(uTime * 1.5) * 0.5 + 0.5);
    vec3 planeColor = mix(vec3(0.0), edgeColor * 6.5, edge);
    float finalAlpha = max(strength, edge);
    gl_FragColor = vec4(planeColor, finalAlpha);
  }
`;

export interface ShaderLoaderProps {
  promptText?: string;
  borderColor?: string;
  transitionDuration?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function ShaderLoader({
  promptText = 'CLICK TO REVEAL',
  borderColor = '#0066ff',
  transitionDuration = 3.0,
  className = '',
  children,
}: ShaderLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    const prompt = promptRef.current;
    if (!canvas || !loader) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const uniforms = {
      uTransition: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0.0 },
      uBorderColor: { value: new THREE.Color(borderColor) },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    scene.add(new THREE.Mesh(geometry, material));

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', handleResize);

    let isRevealed = false;

    const handleClick = () => {
      if (isRevealed) return;
      isRevealed = true;

      if (prompt) {
        gsap.to(prompt, { opacity: 0, y: -25, duration: 0.5, ease: 'power2.inOut' });
      }

      gsap.to(uniforms.uTransition, {
        value: 1.0,
        duration: transitionDuration,
        ease: 'power2.inOut',
        onComplete: () => { loader.style.pointerEvents = 'none'; },
      });
    };

    window.addEventListener('click', handleClick);

    const clock = new THREE.Clock();
    let rafId: number;

    function tick() {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [borderColor, transitionDuration]);

  return (
    <>
      <div
        ref={loaderRef}
        className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
        style={{ height: '100dvh', pointerEvents: 'all' }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 z-10 h-full w-full" />
        <p
          ref={promptRef}
          className="relative z-20 cursor-pointer font-sans tracking-widest text-white"
        >
          {promptText}
        </p>
      </div>
      {children}
    </>
  );
}
