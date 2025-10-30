/**
 * Simple non-cryptographic stable hash (FNV-1a 32-bit) returning base36 string
 */
export function fastHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash >>> 0) * 0x01000193;
  }
  return (hash >>> 0).toString(36);
}
