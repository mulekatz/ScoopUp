export const NETWORK = (import.meta.env.VITE_NETWORK ?? "test") as
  | "main"
  | "test";
export const NODE_URL =
  import.meta.env.VITE_NODE_URL ?? `https://node-${NETWORK}net.vechain.energy`;
export const WALLETS = "veworld";

export const backendURL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

export const SUBMISSION_TIMELIMIT = 60 * 1000; // 1 minute
