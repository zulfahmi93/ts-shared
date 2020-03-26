export function isBrowserSupported(): boolean {
  return 'Promise' in window && 'isFinite' in Number;
}
