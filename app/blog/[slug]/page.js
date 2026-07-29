import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ClientEffects from "../../components/ClientEffects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerClient, fetchSettings } from "../../lib/supabaseServer";
import { ytEmbed, SITE_NAME } from "../../lib/site";

export const dynamic = "force-dynamic";

function fmtDate(d) { if (!d) return ""; try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } }

async function getBlog(slug) {
  const sb = getServerClient();
  const { data } = await sb.from("gyaan_blogs").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }) {
  const b = await getBlog(params.slug);
  if (!b) return { title: "Article not found" };
  const title = b.seo_title || `${b.title} | ${SITE_NAME} Blog`;
  const description = b.seo_description || b.excerpt || (b.body ? b.body.slice(0, 155) : b.title);
  return {
    title, description,
    alternates: { canonical: `/blog/${b.slug}` },
    openGraph: { title, description, type: "article", images: b.image_url ? [b.image_url] : [] },
    twitter: { card: "summary_large_image", title, description, images: b.image_url ? [b.image_url] : [] },
  };
}

export default async function BlogArticle({ params }) {
  const [settings, b] = await Promise.all([fetchSettings(), getBlog(params.slug)]);
  if (!b) notFound();
  const embed = ytEmbed(b.youtube_url);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: b.title,
    description: b.excerpt || undefined,
    image: b.image_url || undefined,
    datePublished: b.published_at || undefined,
    author: { "@type": "Organization", name: b.author || SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav active="/blog" />
      <section className="page-hero">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/blog">Blog</Link></div>
          <span className="eyebrow eyebrow--light">{b.category || "Article"}{b.language ? " · " + b.language : ""}</span>
          <h1>{b.title}</h1>
          <p>{fmtDate(b.published_at)} · {b.author || "Gyaan TV Desk"}</p>
        </div>
      </section>
      <section className="section">
        <article className="container article" style={{ maxWidth: 820 }}>
          {b.image_url && <img src={b.image_url} alt={b.title} className="article-cover" />}
          {b.excerpt && <p className="article-lead">{b.excerpt}</p>}
          {b.body && <div className="article-body" style={{ whiteSpace: "pre-line" }}>{b.body}</div>}
          {embed && (
            <div className="ms-video" style={{ marginTop: 24 }}>
              <iframe src={embed} title={b.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}
          {b.tags && <div className="article-tags">{b.tags.split(",").map((t) => <span key={t}>#{t.trim()}</span>)}</div>}
          <div style={{ marginTop: 32 }}><Link href="/blog" className="btn btn--ghost btn--sm">← All articles</Link></div>
        </article>
      </section>
      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
