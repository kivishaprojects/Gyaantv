import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { getServerClient, fetchSettings } from "../lib/supabaseServer";
import { ytThumb } from "../lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — Devotional Stories, Temple Histories & Spiritual Wisdom",
  description: "Read the Gyaan TV blog: stories of faith, temple histories, lives of saints and kathakaars, festival guides and spiritual wisdom in multiple languages.",
  alternates: { canonical: "/blog" },
};

function fmtDate(d) { if (!d) return ""; try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } }

async function fetchBlogs() {
  const sb = getServerClient();
  const { data } = await sb.from("gyaan_blogs").select("*").eq("published", true).order("published_at", { ascending: false });
  return data || [];
}

export default async function BlogPage() {
  const [settings, blogs] = await Promise.all([fetchSettings(), fetchBlogs()]);
  return (
    <>
      <Nav active="/blog" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Blog</div>
          <span className="eyebrow eyebrow--light">📖 Gyaan &amp; Katha</span>
          <h1>Blog &amp; Articles</h1>
          <p>Stories of faith, temple histories, saints &amp; kathakaars, festivals and spiritual wisdom — in multiple languages.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {blogs.length === 0 ? (
            <div className="admin-empty" style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", color: "#9a8b78" }}>No articles yet. Check back soon. 🙏</div>
          ) : (
            <div className="grid grid-3">
              {blogs.map((b) => {
                const cover = b.image_url || ytThumb(b.youtube_url);
                return (
                  <Link key={b.id} href={"/blog/" + b.slug} className="blog-card reveal">
                    <div className={"bthumb " + (b.thumb || "tg1")} style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}></div>
                    <div className="bbody">
                      <div className="bcat">{b.category || "Article"}{b.language ? " · " + b.language : ""}</div>
                      <h4>{b.title}</h4>
                      {b.excerpt && <p>{b.excerpt}</p>}
                      <div className="bmeta"><span>{fmtDate(b.published_at)}</span><span>{b.author || "Gyaan TV Desk"}</span></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
