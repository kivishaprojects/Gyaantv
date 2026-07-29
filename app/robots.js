const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gyaan-tv-site.vercel.app";

export default function robots() {
  const base = SITE_URL.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
