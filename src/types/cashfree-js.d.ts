declare module '@cashfreepayments/cashfree-js' {
  export const Cashfree: any;
  export function load(options: { mode: string }): Promise<any>;
}