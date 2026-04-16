import * as THREE from 'three';

/** Canvas-generated soft radial gradient — works everywhere, no file needed. */
let _softCircle: THREE.Texture | null = null;

export function getSoftCircleTexture(): THREE.Texture {
  if (_softCircle) return _softCircle;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;

  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.7)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.25)');
  gradient.addColorStop(0.75, 'rgba(255,255,255,0.06)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  _softCircle = tex;
  return tex;
}

/** Larger, softer nebula blob texture */
let _nebulaBlob: THREE.Texture | null = null;

export function getNebulaBlobTexture(): THREE.Texture {
  if (_nebulaBlob) return _nebulaBlob;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;

  // Multi-stop very soft gradient
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.2)');
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.06)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  _nebulaBlob = tex;
  return tex;
}
