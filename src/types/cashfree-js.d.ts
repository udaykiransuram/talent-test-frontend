declare module '@cashfreepayments/cashfree-js' {
  export const Cashfree: unknown;
  export function load(options: { mode: string }): Promise<unknown>;
}