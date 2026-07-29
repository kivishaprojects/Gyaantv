// Shared helpers for the directory / mini-sites / SEO.

export const SITE_NAME = "Gyaan TV";
export const SITE_TAGLINE = "World's Largest Devotional & Pilgrimage Platform";

export const CATEGORY_META = {
  temple:      { label: "Temple",              plural: "Temples",              thumb: "tg1", icon: "🛕" },
  artist:      { label: "Artist",              plural: "Artists",              thumb: "tg2", icon: "🎤" },
  kathakaar:   { label: "Kathakaar",           plural: "Kathakaars",           thumb: "tg3", icon: "🙏" },
  trust_ngo:   { label: "Trust / NGO",         plural: "Trusts & NGOs",        thumb: "tg5", icon: "🤝" },
  saint:       { label: "Saint",               plural: "Saints",               thumb: "tg4", icon: "🕉" },
  rishi:       { label: "Rishi / Muni",        plural: "Rishis & Munis",       thumb: "tg6", icon: "📿" },
  personality: { label: "Religious Personality", plural: "Religious Personalities", thumb: "tg1", icon: "✨" },
  other:       { label: "Listing",             plural: "Listings",             thumb: "tg2", icon: "🔆" },
};

export function catMeta(cat) {
  return CATEGORY_META[cat] || CATEGORY_META.other;
}

export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || "listing";
}

// Extract a YouTube video id from any common URL form.
export function ytId(url) {
  if (!url) return null;
  const s = String(url).trim();
  const m =
    s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/) ||
    s.match(/^([A-Za-z0-9_-]{11})$/);
  return m ? m[1] : null;
}
export function ytEmbed(url) {
  const id = ytId(url);
  return id ? "https://www.youtube.com/embed/" + id : null;
}
export function ytThumb(url) {
  const id = ytId(url);
  return id ? "https://img.youtube.com/vi/" + id + "/hqdefault.jpg" : null;
}

// Split a textarea of links (one per line / comma) into clean YouTube urls.
export function videoList(main, extra) {
  const raw = [main, ...String(extra || "").split(/[\n,]+/)].filter(Boolean);
  const seen = new Set();
  const out = [];
  raw.forEach((u) => {
    const id = ytId(u);
    if (id && !seen.has(id)) { seen.add(id); out.push(id); }
  });
  return out; // array of video ids
}
