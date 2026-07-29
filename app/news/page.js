import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

export default async function NewsPage() {
  const [settings, news] = await Promise.all([fetchSettings(), fetchTable("gyaan_news")]);

  // Distinct languages present, for the filter tabs
  const langs = [];
  news.forEach((n) => {
    const l = (n.language || "").trim();
    if (l && !langs.includes(l)) langs.push(l);
  });

  return (
    <>
      <Nav active="/news" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / News</div>
          <span className="eyebrow eyebrow--light">📰 Religious News &amp; Updates</span>
          <h1>News &amp; Blogs</h1>
          <p>Latest devotional news, temple updates and spiritual stories — published in multiple languages and refreshed regularly.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {langs.length > 1 && (
            <div className="tabs">
              <button className="tab active" data-filter="all">All</button>
              {langs.map((l) => (
                <button key={l} className="tab" data-filter={l}>{l}</button>
              ))}
            </div>
          )}

          {news.length === 0 ? (
            <div className="admin-empty" style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", color: "#9a8b78" }}>
              No news yet. Please check back soon. 🙏
            </div>
          ) : (
            <div className="grid grid-3">
              {news.map((n) => (
                <article key={n.id} className="news-card reveal" data-cat={(n.language || "").trim()}>
                  <div className={"news-thumb " + (n.thumb || "tg1")}>
                    {n.language && <span className="news-lang">{n.language}</span>}
                    {n.category && <span className="news-cat">{n.category}</span>}
                  </div>
                  <div className="news-body">
                    <div className="news-meta">{fmtDate(n.published_at)}</div>
                    <h3>{n.title}</h3>
                    {n.excerpt && <p>{n.excerpt}</p>}
                    {n.body && (
                      <details className="news-more">
                        <summary>Read more</summary>
                        <p style={{ whiteSpace: "pre-line", marginTop: 10 }}>{n.body}</p>
                      </details>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
