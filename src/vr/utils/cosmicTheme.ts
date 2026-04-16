/**
 * Cosmic VR Theme — Deep navy/purple starry night aesthetic
 * Inspired by: midnight sky with moon, shooting stars, purple nebula, magenta glow
 */

export const COSMIC = {
  // Sky / background tones
  skyDeep: '#060818',        // deepest navy black
  skyMid: '#0c1030',         // mid navy
  skyHorizon: '#1a1040',     // purple-navy horizon

  // Nebula palette — purple/magenta/blue
  nebulaPurple: '#6B21A8',
  nebulaMagenta: '#C026D3',
  nebulaBlue: '#2563EB',
  nebulaIndigo: '#4338CA',
  nebulaPink: '#DB2777',
  nebulaViolet: '#7C3AED',

  // Stars
  starWhite: '#FFFFFF',
  starBlue: '#93C5FD',
  starCyan: '#67E8F9',
  starPink: '#F9A8D4',

  // Moon
  moonGlow: '#F0F0FF',
  moonCore: '#E8E8F8',

  // Shooting star
  shootingCore: '#FFFFFF',
  shootingTrail: '#93C5FD',

  // Accent — gold still used for interactive elements / portals
  gold: '#FFD700',
  goldSoft: '#FFE4A0',

  // Floor tones
  floorDark: '#080818',
  floorReflect: '#0a0a2a',

  // Fog
  fogColor: '#060818',

  // Default nebula array for NebulaClouds component
  nebulaColors: ['#6B21A8', '#C026D3', '#2563EB', '#4338CA', '#7C3AED', '#DB2777'],

  // Per-experience nebula variants
  nightNebula: ['#2e1065', '#6B21A8', '#4338CA', '#1e1b4b'],
  morningNebula: ['#7C3AED', '#C026D3', '#6B21A8', '#DB2777'],
  sanctuaryNebula: ['#4338CA', '#6B21A8', '#2563EB', '#7C3AED'],
  heavensNebula: ['#6B21A8', '#C026D3', '#2563EB', '#DB2777'],
  arcadeNebula: ['#7C3AED', '#2563EB', '#C026D3', '#4338CA'],

  // Star palette for dome
  starPalette: ['#FFFFFF', '#93C5FD', '#67E8F9', '#F9A8D4', '#E8E8F8', '#C4B5FD'],
} as const;
