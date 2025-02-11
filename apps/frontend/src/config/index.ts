export const NETWORK = (import.meta.env.VITE_NETWORK ?? "test") as
  | "main"
  | "test";
export const NODE_URL =
  import.meta.env.VITE_NODE_URL ?? `https://node-${NETWORK}net.vechain.energy`;
export const WALLETS = "veworld";

export const backendURL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

export const SUBMISSION_TIMELIMIT = {
  FIRST_TO_SECOND: 10 * 60 * 1000, // 10 Minuten
  SECOND_TO_THIRD: 60 * 60 * 1000, // 60 Minuten
  THIRD_TO_SUBMIT: 10 * 60 * 1000, // 10 Minuten
} as const;
