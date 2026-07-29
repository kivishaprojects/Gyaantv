import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

// Read-only server client (anon key). Used by public pages to fetch content.
export function getServerClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Convenience fetch helpers
export async function fetchTable(table, { order = "sort", ascending = true, filter } = {}) {
  const sb = getServerClient();
  let q = sb.from(table).select("*");
  if (filter) q = q.eq(filter.col, filter.val);
  q = q.order(order, { ascending });
  const { data, error } = await q;
  if (error) {
    console.error("fetchTable error", table, error.message);
    return [];
  }
  return data || [];
}

export async function fetchSettings() {
  const sb = getServerClient();
  const { data } = await sb.from("gyaan_settings").select("*");
  const map = {};
  (data || []).forEach((r) => (map[r.key] = r.value));
  return map;
}
