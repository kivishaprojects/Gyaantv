import { getServerClient } from "./lib/supabaseServer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gyaan-tv-site.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = SITE_URL.replace(/\/$/, "");
  const staticRoutes = [
    "", "/live", "/artists", "/kathakaar", "/directory", "/trusts", "/programmes",
    "/news", "/blog", "/events", "/pilgrimage", "/subscribe", "/list-yourself", "/about",
  ].map((p) => ({ url: base + p, changeFrequency: "daily", priority: p === "" ? 1 : 0.7 }));

  let dynamicRoutes = [];
  try {
    const sb = getServerClient();
    const [{ data: listings }, { data: blogs }] = await Promise.all([
      sb.from("gyaan_listings").select("slug, created_at").eq("status", "approved"),
      sb.from("gyaan_blogs").select("slug, published_at").eq("published", true),
    ]);
    (listings || []).forEach((l) => l.slug && dynamicRoutes.push({ url: `${base}/listing/${l.slug}`, lastModified: l.created_at, priority: 0.6 }));
    (blogs || []).forEach((b) => b.slug && dynamicRoutes.push({ url: `${base}/blog/${b.slug}`, lastModified: b.published_at, priority: 0.6 }));
  } catch (e) {}

  return [...staticRoutes, ...dynamicRoutes];
}
