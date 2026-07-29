import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ClientEffects from "../../components/ClientEffects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerClient, fetchSettings } from "../../lib/supabaseServer";
import { catMeta, videoList, SITE_NAME } from "../../lib/site";

export const dynamic = "force-dynamic";

async function getListing(slug) {
  const sb = getServerClient();
  const { data } = await sb.from("gyaan_listings").select("*").eq("slug", slug).eq("status", "approved").maybeSingle();
  return data;
}

export async function generateMetadata({ params }) {
  const item = await getListing(params.slug);
  if (!item) return { title: "Listing not found" };
  const meta = catMeta(item.category);
  const title = item.seo_title || `${item.name} — ${meta.label} | ${SITE_NAME}`;
  const description = item.seo_description || item.tagline || (item.about ? item.about.slice(0, 155) : `${item.name} on Gyaan TV.`);
  const img = item.cover_url || item.image_url;
  return {
    title,
    description,
    alternates: { canonical: `/listing/${item.slug}` },
    openGraph: { title, description, type: "profile", images: img ? [img] : [] },
    twitter: { card: img ? "summary_large_image" : "summary", title, description, images: img ? [img] : [] },
  };
}

export default async function ListingPage({ params }) {
  const [settings, item] = await Promise.all([fetchSettings(), getListing(params.slug)]);
  if (!item) notFound();
  const meta = catMeta(item.category);
  const vids = videoList(item.youtube_url, item.videos);
  const gallery = String(item.gallery || "").split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const socials = [
    item.website && ["Website", item.website],
    item.youtube_channel && ["YouTube", item.youtube_channel],
    item.facebook && ["Facebook", item.facebook],
    item.instagram && ["Instagram", item.instagram],
  ].filter(Boolean);

  const isOrg = item.category === "trust_ngo" || item.category === "temple";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isOrg ? "Organization" : "Person",
    name: item.name,
    description: item.tagline || (item.about ? item.about.slice(0, 200) : undefined),
    image: item.image_url || item.cover_url || undefined,
    address: [item.place, item.city, item.state].filter(Boolean).join(", ") || undefined,
    email: item.contact_email || undefined,
    telephone: item.contact_phone || undefined,
    url: item.website || undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav active="/directory" />

      <section className="ms-hero" style={item.cover_url ? { backgroundImage: `linear-gradient(180deg, rgba(42,18,6,.35), rgba(42,18,6,.82)), url(${item.cover_url})` } : undefined}>
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/directory">Directory</Link> / {item.name}</div>
          <div className="ms-head">
            <div className="ms-avatar" style={item.image_url ? { backgroundImage: `url(${item.image_url})` } : undefined}>
              {!item.image_url && <span>{item.name.slice(0, 2)}</span>}
            </div>
            <div>
              <span className="ms-cat">{meta.icon} {meta.label}</span>
              <h1>{item.name}</h1>
              {item.tagline && <p className="ms-tag">{item.tagline}</p>}
              {(item.place || item.city || item.state) && (
                <p className="ms-loc">📍 {[item.place, item.city, item.state].filter(Boolean).join(", ")}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container ms-grid">
          <div className="ms-main">
            {item.about && (
              <div className="ms-block">
                <h2 className="ms-h">About</h2>
                <p style={{ whiteSpace: "pre-line" }}>{item.about}</p>
              </div>
            )}
            {gallery.length > 0 && (
              <div className="ms-block">
                <h2 className="ms-h">Photo Gallery</h2>
                <div className="ms-gallery">
                  {gallery.map((src, i) => (
                    <a key={i} href={src} target="_blank" rel="noreferrer" className="ms-gitem" style={{ backgroundImage: `url(${src})` }} />
                  ))}
                </div>
              </div>
            )}
            {vids.length > 0 && (
              <div className="ms-block">
                <h2 className="ms-h">Videos</h2>
                <div className="ms-videos">
                  {vids.map((id) => (
                    <div key={id} className="ms-video">
                      <iframe src={"https://www.youtube.com/embed/" + id} title="Video" loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="ms-side">
            <div className="ms-card">
              <h3 className="ms-h" style={{ fontSize: 18 }}>Details</h3>
              <ul className="ms-info">
                <li><b>Category</b><span>{meta.label}</span></li>
                {item.languages && <li><b>Languages</b><span>{item.languages}</span></li>}
                {item.established && <li><b>Established</b><span>{item.established}</span></li>}
                {item.contact_phone && <li><b>Phone</b><a href={"tel:" + item.contact_phone}>{item.contact_phone}</a></li>}
                {item.contact_email && <li><b>Email</b><a href={"mailto:" + item.contact_email}>{item.contact_email}</a></li>}
              </ul>
              {socials.length > 0 && (
                <div className="ms-socials">
                  {socials.map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">{label}</a>
                  ))}
                </div>
              )}
            </div>
            <div className="ms-card ms-cta">
              <p>Is this your page?</p>
              <Link href="/list-yourself" className="btn btn--primary btn--sm" style={{ justifyContent: "center" }}>Manage / claim →</Link>
            </div>
          </aside>
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
