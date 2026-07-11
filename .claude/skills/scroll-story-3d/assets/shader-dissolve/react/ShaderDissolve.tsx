'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import * as THREE from 'three';

const coverVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coverFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uGrayscale;
  uniform float uEdgeIntensity;
  uniform float uEdgeBrightness;
  varying vec2 vUv;

  mat3 sobelX = mat3(-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0);
  mat3 sobelY = mat3(-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);

  float getLuminance(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0, gy = 0.0;
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i+1][j+1];
        gy += lum * sobelY[i+1][j+1];
      }
    }
    return sqrt(gx * gx + gy * gy);
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5, f = 1.0;
    for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; }
    return v;
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x/uResolution.y)/(uImageResolution.x/uImageResolution.y), 1.0),
      min((uResolution.y/uResolution.x)/(uImageResolution.y/uImageResolution.x), 1.0)
    );
    vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
    vec4 texColor = texture2D(uTexture, uv);
    float gray = getLuminance(texColor.rgb);
    texColor.rgb = mix(texColor.rgb, vec3(gray), uGrayscale);

    vec2 centeredUv = vUv - uCenter;
    float aspect = uResolution.x / uResolution.y;
    centeredUv.x *= aspect;
    float dist = length(centeredUv);
    float noiseScale = 6.0;
    vec2 pixelatedUv = floor(vUv * uResolution / noiseScale) * noiseScale / uResolution;
    float totalNoise = fbm(pixelatedUv * 100.0) * 0.15 + fbm(vec2(atan(centeredUv.y, centeredUv.x) * 5.0, 0.0)) * 0.15;
    float normalizedDist = (dist + totalNoise) / length(vec2(aspect * 0.5, 0.5));
    float dissolveThreshold = uDissolve * 1.5;
    float dissolveMask = smoothstep(dissolveThreshold - 0.03, dissolveThreshold, normalizedDist);

    vec2 texelSize = 1.0 / uResolution;
    float edge = clamp(pow(sobel(uTexture, uv, texelSize), 0.7) * 2.0, 0.0, 1.0);
    vec3 baseColor = mix(texColor.rgb, vec3(0.0), uGrayscale);
    vec3 finalColor = baseColor + vec3(1.0) * edge * uEdgeIntensity * 2.0 * (1.0 + uGrayscale * 3.0) * uEdgeBrightness;

    float edgeZoneWidth = 0.15 * (1.0 - uDissolve) + 0.02;
    float edgeZone = smoothstep(dissolveThreshold - edgeZoneWidth, dissolveThreshold - edgeZoneWidth + 0.04, normalizedDist)
      * smoothstep(dissolveThreshold + 0.02, dissolveThreshold - 0.02, normalizedDist);
    float sparkle = hash(floor(vUv * uResolution / 4.0)) * edgeZone;
    finalColor += vec3(sparkle * 3.0 * (1.0 - uDissolve) * uEdgeBrightness * (1.0 + uGrayscale * 2.0));

    gl_FragColor = vec4(finalColor, dissolveMask * texColor.a);
  }
`;

const coverFragmentShaderReverse = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uEdgeIntensity;
  uniform float uDarkness;
  uniform float uGrayscale;
  varying vec2 vUv;

  mat3 sobelX = mat3(-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0);
  mat3 sobelY = mat3(-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);

  float getLuminance(vec3 color) { return dot(color, vec3(0.299, 0.587, 0.114)); }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0, gy = 0.0;
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i+1][j+1];
        gy += lum * sobelY[i+1][j+1];
      }
    }
    return sqrt(gx * gx + gy * gy);
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x/uResolution.y)/(uImageResolution.x/uImageResolution.y), 1.0),
      min((uResolution.y/uResolution.x)/(uImageResolution.y/uImageResolution.x), 1.0)
    );
    vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
    vec4 texColor = texture2D(uTexture, uv);
    float gray = getLuminance(texColor.rgb);
    texColor.rgb = mix(texColor.rgb, vec3(gray), uGrayscale);

    vec2 texelSize = 1.0 / uResolution;
    float edge = clamp(pow(sobel(uTexture, uv, texelSize), 0.7) * 2.0, 0.0, 1.0);
    vec3 baseColor = mix(texColor.rgb, vec3(0.0), uDarkness);
    vec3 finalColor = clamp(baseColor + vec3(1.0) * edge * uEdgeIntensity * 2.0, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

export interface ShaderDissolveProps {
  imageTop?: string;
  imageBottom?: string;
  className?: string;
}

export default function ShaderDissolve({
  imageTop = 'https://images.unsplash.com/photo-1577081395884-e70fc91645ad?q=80&w=1134&auto=format&fit=crop',
  imageBottom = 'https://images.unsplash.com/photo-1705167110557-a16203e0fe24?q=80&w=1274&auto=format&fit=crop',
  className = '',
}: ShaderDissolveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const renderer1Ref = useRef<THREE.WebGLRenderer | null>(null);
  const renderer2Ref = useRef<THREE.WebGLRenderer | null>(null);
  const material1Ref = useRef<THREE.ShaderMaterial | null>(null);
  const material2Ref = useRef<THREE.ShaderMaterial | null>(null);
  const scene1Ref = useRef<THREE.Scene | null>(null);
  const scene2Ref = useRef<THREE.Scene | null>(null);
  const camera1Ref = useRef<THREE.OrthographicCamera | null>(null);
  const camera2Ref = useRef<THREE.OrthographicCamera | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas1 = document.createElement('div');
    canvas1.className = 'shader-dissolve__canvas';
    canvas1.style.cssText = 'position:fixed;inset:0;height:100vh;width:100%;z-index:2;';
    const canvas2 = document.createElement('div');
    canvas2.className = 'shader-dissolve__canvas';
    canvas2.style.cssText = 'position:fixed;inset:0;height:100vh;width:100%;z-index:1;';
    container.appendChild(canvas1);
    container.appendChild(canvas2);

    const scene1 = new THREE.Scene();
    const camera1 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera1.position.z = 1;
    const renderer1 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer1.setSize(window.innerWidth, window.innerHeight);
    canvas1.appendChild(renderer1.domElement);

    const scene2 = new THREE.Scene();
    const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera2.position.z = 1;
    const renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer2.setSize(window.innerWidth, window.innerHeight);
    canvas2.appendChild(renderer2.domElement);

    scene1Ref.current = scene1;
    scene2Ref.current = scene2;
    camera1Ref.current = camera1;
    camera2Ref.current = camera2;
    renderer1Ref.current = renderer1;
    renderer2Ref.current = renderer2;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(imageTop, (texture) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uImageResolution: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
          uDissolve: { value: 0.0 },
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uTime: { value: 0.0 },
          uGrayscale: { value: 0.0 },
          uEdgeIntensity: { value: 0.0 },
          uEdgeBrightness: { value: 1.0 }
        },
        vertexShader: coverVertexShader,
        fragmentShader: coverFragmentShader,
        transparent: true
      });
      material1Ref.current = mat;
      scene1.add(new THREE.Mesh(geometry, mat));
    });

    textureLoader.load(imageBottom, (texture) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uImageResolution: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
          uEdgeIntensity: { value: 0.6 },
          uDarkness: { value: 1.0 },
          uGrayscale: { value: 1.0 }
        },
        vertexShader: coverVertexShader,
        fragmentShader: coverFragmentShaderReverse,
        transparent: true
      });
      material2Ref.current = mat;
      scene2.add(new THREE.Mesh(geometry, mat));
    });

    const lenis = new Lenis();
    lenisRef.current = lenis;

    const handleResize = () => {
      renderer1.setSize(window.innerWidth, window.innerHeight);
      renderer2.setSize(window.innerWidth, window.innerHeight);
      material1Ref.current?.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      material2Ref.current?.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    lenis.on('scroll', ({ progress }: { progress: number }) => {
      if (material1Ref.current) {
        material1Ref.current.uniforms.uDissolve.value = progress;
        material1Ref.current.uniforms.uGrayscale.value = Math.min(1.0, progress / 0.4);
        material1Ref.current.uniforms.uEdgeIntensity.value = progress * 0.5;
        material1Ref.current.uniforms.uEdgeBrightness.value = 1.0 - progress;
      }
      if (material2Ref.current) {
        const ap = Math.min(1.0, progress * 1.1);
        material2Ref.current.uniforms.uEdgeIntensity.value = 0.6 * (1.0 - ap);
        material2Ref.current.uniforms.uDarkness.value = 1.0 - ap;
        material2Ref.current.uniforms.uGrayscale.value = 1.0 - ap;
      }
    });

    function raf(time: number) {
      lenis.raf(time);
      const t = time * 0.001;
      material1Ref.current?.uniforms.uTime.value = t;
      renderer1.render(scene1, camera1);
      renderer2.render(scene2, camera2);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      window.removeEventListener('resize', handleResize);
      renderer1.dispose();
      renderer2.dispose();
      canvas1.remove();
      canvas2.remove();
    };
  }, [imageTop, imageBottom]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: '300vh' }}
    />
  );
}
