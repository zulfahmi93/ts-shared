/**
 * @param {number} ms
 * @return {Promise<void>}
 */
export function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}
