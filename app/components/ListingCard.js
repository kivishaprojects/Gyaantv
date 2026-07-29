import Link from "next/link";
import { catMeta, ytThumb } from "../lib/site";

export default function ListingCard({ item }) {
  const meta = catMeta(item.category);
  const cover = item.cover_url || item.image_url || ytThumb(item.youtube_url);
  return (
    <Link href={"/listing/" + item.slug} className="listing-card reveal">
      <div className={"lc-cover " + meta.thumb} style={cover ? { backgroundImage: `url(${cover})` } : undefined}>
        <span className="lc-badge">{meta.icon} {meta.label}</span>
        {item.featured && <span className="lc-featured">★ Featured</span>}
      </div>
      <div className="lc-body">
        <div className="lc-avatar" style={item.image_url ? { backgroundImage: `url(${item.image_url})` } : undefined}>
          {!item.image_url && <span>{(item.name || "?").slice(0, 2)}</span>}
        </div>
        <h3>{item.name}</h3>
        {item.tagline && <p className="lc-tag">{item.tagline}</p>}
        {(item.city || item.state || item.place) && (
          <p className="lc-loc">📍 {[item.place, item.city, item.state].filter(Boolean).join(", ")}</p>
        )}
        <span className="lc-link">View mini-site →</span>
      </div>
    </Link>
  );
}
