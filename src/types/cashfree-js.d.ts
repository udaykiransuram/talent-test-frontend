declare module '@cashfreepayments/cashfree-js' {
  export interface CashfreeSDK {
    checkout(options: { paymentSessionId: string }): Promise<void>;
    // Add other methods if needed
  }
  export function load(options: { mode: string }): Promise<CashfreeSDK>;
}