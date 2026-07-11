import Lenis from 'lenis';
import * as THREE from 'three';

const lenis = new Lenis();

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

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

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

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
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
    float edge = sobel(uTexture, uv, texelSize);
    edge = clamp(pow(edge, 0.7) * 2.0, 0.0, 1.0);

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

const container1 = document.querySelector('.canvas1');
const scene1 = new THREE.Scene();
const camera1 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera1.position.z = 1;
const renderer1 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer1.setSize(window.innerWidth, window.innerHeight);
container1.appendChild(renderer1.domElement);

const container2 = document.querySelector('.canvas2');
const scene2 = new THREE.Scene();
const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera2.position.z = 1;
const renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer2.setSize(window.innerWidth, window.innerHeight);
container2.appendChild(renderer2.domElement);

container1.style.zIndex = '2';
container2.style.zIndex = '1';

const geometry = new THREE.PlaneGeometry(2, 2);
const textureLoader = new THREE.TextureLoader();

let material1, material2;

const imageTop = 'https://images.unsplash.com/photo-1577081395884-e70fc91645ad?q=80&w=1134&auto=format&fit=crop';
const imageBottom = 'https://images.unsplash.com/photo-1705167110557-a16203e0fe24?q=80&w=1274&auto=format&fit=crop';

textureLoader.load(imageTop, (texture) => {
  material1 = new THREE.ShaderMaterial({
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
  scene1.add(new THREE.Mesh(geometry, material1));
});

textureLoader.load(imageBottom, (texture) => {
  material2 = new THREE.ShaderMaterial({
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
  scene2.add(new THREE.Mesh(geometry, material2));
});

window.addEventListener('resize', () => {
  renderer1.setSize(window.innerWidth, window.innerHeight);
  renderer2.setSize(window.innerWidth, window.innerHeight);
  if (material1) material1.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  if (material2) material2.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

lenis.on('scroll', ({ progress }) => {
  if (material1) {
    material1.uniforms.uDissolve.value = progress;
    material1.uniforms.uGrayscale.value = Math.min(1.0, progress / 0.4);
    material1.uniforms.uEdgeIntensity.value = progress * 0.5;
    material1.uniforms.uEdgeBrightness.value = 1.0 - progress;
  }
  if (material2) {
    const acceleratedProgress = Math.min(1.0, progress * 1.1);
    material2.uniforms.uEdgeIntensity.value = 0.6 * (1.0 - acceleratedProgress);
    material2.uniforms.uDarkness.value = 1.0 - acceleratedProgress;
    material2.uniforms.uGrayscale.value = 1.0 - acceleratedProgress;
  }
});

function raf(time) {
  lenis.raf(time);
  const timeInSeconds = time * 0.001;
  if (material1) material1.uniforms.uTime.value = timeInSeconds;
  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
