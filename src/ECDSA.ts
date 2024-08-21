import { EllipticCurve } from "./interface/EllipticCurve";
import { PublicKey } from "./types/PublicKey";
import { PrivateKey } from "./types/PrivateKey";
import { Signature } from "./types/Signature";
import { ELLIPTIC_CURVE } from "./constants";

// Helper function to perform modular inversion
function modInverse(k: bigint, p: bigint): bigint {
  let [m0, x0, x1] = [p, 0n, 1n];
  if (p == 1n) return 0n;
  while (k > 1n) {
    let q = k / p;
    [p, k] = [k % p, p];
    [x0, x1] = [x1 - q * x0, x0];
  }
  return x1 < 0n ? x1 + m0 : x1;
}

// Elliptic curve point addition
function pointAdd(P: PublicKey, Q: PublicKey, curve: EllipticCurve): PublicKey {
  if (P.x === 0n && P.y === 0n) return Q;
  if (Q.x === 0n && Q.y === 0n) return P;
  if (P.x === Q.x && P.y !== Q.y) return { x: 0n, y: 0n }; // Point at infinity

  const lambda = ((Q.y - P.y) * modInverse(Q.x - P.x, curve.p)) % curve.p;
  const xR = (lambda ** 2n - P.x - Q.x) % curve.p;
  const yR = (lambda * (P.x - xR) - P.y) % curve.p;
  return { x: (xR + curve.p) % curve.p, y: (yR + curve.p) % curve.p };
}

// Elliptic curve point doubling
function pointDouble(P: PublicKey, curve: EllipticCurve): PublicKey {
  if (P.y === 0n) return { x: 0n, y: 0n }; // Point at infinity

  const lambda =
    ((3n * P.x ** 2n + curve.a) * modInverse(2n * P.y, curve.p)) % curve.p;
  const xR = (lambda ** 2n - 2n * P.x) % curve.p;
  const yR = (lambda * (P.x - xR) - P.y) % curve.p;
  return { x: (xR + curve.p) % curve.p, y: (yR + curve.p) % curve.p };
}

// Scalar multiplication on the elliptic curve
function scalarMult(k: bigint, P: PublicKey, curve: EllipticCurve): PublicKey {
  let result: PublicKey | null = null;
  let addend = P;

  while (k > 0n) {
    if (k % 2n === 1n) {
      result = result ? pointAdd(result, addend, curve) : addend;
    }
    addend = pointDouble(addend, curve);
    k = k / 2n;
  }

  return result || { x: 0n, y: 0n }; // If result is null, return point at infinity
}

// Generate a key pair
export function generateKeyPair(curve: EllipticCurve): {
  privateKey: PrivateKey;
  publicKey: PublicKey;
} {
  const privateKey: PrivateKey =
    1n + BigInt(Math.floor(Math.random() * Number(curve.n - 1n)));
  const publicKey: PublicKey = scalarMult(privateKey, curve.G, curve);
  return { privateKey, publicKey };
}

// Sign a message
export function signMessage(
  message: string,
  privateKey: PrivateKey,
  curve: EllipticCurve
): Signature {
  const z = BigInt(`0x${Buffer.from(message).toString("hex")}`);
  let k: bigint;
  let r: bigint;
  let s: bigint;

  do {
    k = 1n + BigInt(Math.floor(Math.random() * Number(curve.n - 1n)));
    const { x: xR } = scalarMult(k, curve.G, curve);
    r = xR % curve.n;
    s = (modInverse(k, curve.n) * (z + r * privateKey)) % curve.n;
  } while (r === 0n || s === 0n);

  return { r, s };
}

// Verify a signature
export function verifySignature(
  message: string,
  signature: Signature,
  publicKey: PublicKey,
  curve: EllipticCurve
): boolean {
  const z = BigInt(`0x${Buffer.from(message).toString("hex")}`);
  const { r, s } = signature;

  if (r <= 0n || r >= curve.n || s <= 0n || s >= curve.n) return false;

  const w = modInverse(s, curve.n);
  const u1 = (z * w) % curve.n;
  const u2 = (r * w) % curve.n;

  const P1 = scalarMult(u1, curve.G, curve);
  const P2 = scalarMult(u2, publicKey, curve);

  const { x: xR } = pointAdd(P1, P2, curve);

  return r === xR % curve.n;
}
