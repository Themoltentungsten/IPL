import axios from "axios";

export async function predictFull(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const base = (process.env.ML_SERVICE_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
  const { data } = await axios.post<Record<string, unknown>>(`${base}/predict/v2`, payload, {
    timeout: 20_000,
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
