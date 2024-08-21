/**
 * Represents an elliptic curve in the form of y^2 = x^3 + ax + b (mod p)
 * Check https://www.desmos.com/calculator/5q0juogrqk for a playground.
 */
export interface EllipticCurve {
  a: bigint;
  b: bigint;
  p: bigint; // prime modulus
  G: { x: bigint; y: bigint }; // base point
  n: bigint; // order of the base point
}