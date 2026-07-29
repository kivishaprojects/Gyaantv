import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

const Play = () => (<div className="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></div>);
const LiveBadge = () => (<span className="live-badge"><span className="dot"></span> Live</span>);
const Pin = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);
const Clock = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>);

export default async function LivePage() {
  const [settings, live, news] = await Promise.all([
    fetchSettings(),
    fetchTable("gyaan_live"),
    fetchTable("gyaan_news"),
  ]);
  const darshan = live.filter((l) => l.kind === "darshan");
  const kathas = live.filter((l) => l.kind === "katha");
  const blogs = news.filter((n) => !n.is_ticker);

  return (
    <>
      <Nav active="/live" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Live</div>
          <span className="eyebrow eyebrow--light"><LiveBadge /> &nbsp;Streaming now</span>
          <h1>Live Darshan &amp; Katha</h1>
          <p>Take darshan of India&apos;s holiest temples and join sacred kathas — live, in real time, from wherever you are.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <div className="om-divider reveal"><span>🛕</span></div>
            <h2 className="section-title reveal">Live Temple Darshan</h2>
            <p className="section-lead reveal">Real-time darshan from the most revered shrines across the country.</p>
          </div>
          <div className="grid grid-4">
            {darshan.map((t) => (
              <div key={t.id} className="temple-card reveal">
                <div className={"thumb " + (t.thumb || "tg1")}>
                  <LiveBadge />
                  {t.viewers && (<span className="viewers"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg> {t.viewers}</span>)}
                  <Play />
                </div>
                <div className="body"><h4>{t.title}</h4><p><Pin /> {t.place}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow reveal">🎙 Sacred discourses</span>
            <h2 className="section-title reveal">Live Katha</h2>
            <p className="section-lead reveal">Listen to revered kathakaars narrate timeless scriptures, live each day.</p>
          </div>
          <div className="grid grid-3">
            {kathas.map((k) => (
              <div key={k.id} className="temple-card reveal">
                <div className={"thumb " + (k.thumb || "tg3")}><LiveBadge /><Play /></div>
                <div className="body"><h4>{k.title}</h4><p><Clock /> {k.place}{k.subtitle ? " · " + k.subtitle : ""}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 34 }}>
            <span className="eyebrow reveal">📰 Stay updated</span>
            <h2 className="section-title reveal" style={{ marginBottom: 4 }}>Religious News &amp; Blogs</h2>
          </div>
          <div className="grid grid-3">
            {blogs.map((b) => (
              <article key={b.id} className="blog-card reveal">
                <div className={"bthumb " + (b.thumb || "tg1")}></div>
                <div className="bbody"><div className="bcat">{b.category}</div><h4>{b.title}</h4><p>{b.excerpt}</p>
                  <div className="bmeta"><span>{b.published_at}</span><span>Gyaan TV Desk</span></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
