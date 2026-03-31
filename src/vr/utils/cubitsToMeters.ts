// 1 royal cubit ≈ 0.4572 meters (18 inches)
const CUBIT_TO_METER = 0.4572;

export function cubitsToMeters(cubits: number): number {
  return cubits * CUBIT_TO_METER;
}

export function parseDimensions(dimensionStr: string): { width: number; height: number; depth: number } | null {
  // Parse strings like "5 x 5 x 3 cubits" or "2.5 cubits long, 1.5 cubits wide, 1.5 cubits high"
  const numbers = dimensionStr.match(/[\d.]+/g);
  if (!numbers || numbers.length < 2) return null;

  const vals = numbers.map(Number);
  return {
    width: cubitsToMeters(vals[0]),
    height: vals.length >= 3 ? cubitsToMeters(vals[2]) : cubitsToMeters(vals[1]),
    depth: cubitsToMeters(vals[1]),
  };
}
