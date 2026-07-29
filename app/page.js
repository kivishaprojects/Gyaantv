import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ClientEffects from "./components/ClientEffects";
import HeroBanner from "./components/HeroBanner";
import { fetchTable, fetchSettings } from "./lib/supabaseServer";

export const dynamic = "force-dynamic";

const Play = () => (
  <div className="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></div>
);
const LiveBadge = () => (
  <span className="live-badge"><span className="dot"></span> Live</span>
);
const Pin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const Clock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);

const CATS = [
  ["Katha", "Ram Katha, Bhagwat & more", "tg1", <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>],
  ["Bhajan", "Soulful devotional songs", "tg2", <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>],
  ["Dayro", "Traditional folk gatherings", "tg3", <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>],
  ["Sangeet Sandhya", "Evenings of divine music", "tg4", <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>],
  ["Videos", "On-demand devotional library", "tg5", <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>],
  ["Other Programmes", "Festivals, satsang & specials", "tg6", <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>],
];

export default async function Home() {
  const [settings, live, thoughts, kathakaar, pilgrimage, news, banners] = await Promise.all([
    fetchSettings(),
    fetchTable("gyaan_live"),
    fetchTable("gyaan_thought", { order: "created_at" }),
    fetchTable("gyaan_kathakaar"),
    fetchTable("gyaan_pilgrimage"),
    fetchTable("gyaan_news"),
    fetchTable("gyaan_banner"),
  ]);
  const bannerSlides = banners.filter((b) => b.active);

  const darshan = live.filter((l) => l.kind === "darshan");
  const kathas = live.filter((l) => l.kind === "katha");
  const featuredKk = kathakaar.filter((k) => k.featured).slice(0, 4);
  const thought = thoughts.find((t) => t.active) || thoughts[0];
  const ticker = news.filter((n) => n.is_ticker);
  const counts = {
    shakti: pilgrimage.filter((p) => p.category === "shakti").length,
    jyot: pilgrimage.filter((p) => p.category === "jyotirling").length,
    mandir: pilgrimage.filter((p) => p.category === "mandir").length,
  };
  const heroLive = darshan[0];

  return (
    <>
      <Nav active="/" />

      {/* Admin-managed home banner */}
      <HeroBanner slides={bannerSlides} />

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-label"><span className="dot"></span> Religious News</div>
        <div className="ticker-track">
          <div className="ticker-move">
            {[...ticker, ...ticker].map((n, i) => (
              <span key={i}><b>{n.category}:</b> {n.title}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div>
            <span className="eyebrow eyebrow--light">🕉 World&apos;s Best Regional Devotional OTT</span>
            <h1>{settings.hero_title || "Aapki Aastha, Ab Live & On-Demand"}</h1>
            <p className="lead">{settings.hero_lead}</p>
            <div className="hero-actions">
              <Link href="/live" className="btn btn--primary">Watch Live Now
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
              <Link href="/programmes" className="btn btn--light">Explore Programmes</Link>
            </div>
            <div className="hero-badges">
              <div className="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> {settings.stat_live || "100+"} Live Temple Darshan</div>
              <div className="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2 4 5v6c0 5 8 11 8 11s8-6 8-11V5l-8-3z"/></svg> Trusted Kathakaars</div>
              <div className="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> {settings.stat_langs || "8"} Regional Languages</div>
            </div>
          </div>
          <div className="hero-visual">
            {heroLive && (
              <div className="live-card">
                <div className={"thumb " + (heroLive.thumb || "tg1")}>
                  <LiveBadge />
                  {heroLive.viewers && (
                    <span className="viewers"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg> {heroLive.viewers}</span>
                  )}
                  <Play />
                </div>
                <div className="meta"><h4>Live Darshan — {heroLive.title}</h4><p>{heroLive.place}{heroLive.subtitle ? " · " + heroLive.subtitle : ""}</p></div>
              </div>
            )}
            <div className="hero-thumbs">
              {darshan.slice(1, 4).map((d) => (
                <div key={d.id} className={"mini " + (d.thumb || "tg2")}><span>{d.title}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live now */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 34 }}>
            <div>
              <span className="eyebrow reveal"><span className="live-badge" style={{ padding: "3px 8px" }}><span className="dot"></span>Live</span> &nbsp;Happening now</span>
              <h2 className="section-title reveal" style={{ marginBottom: 4 }}>Live Darshan &amp; Katha</h2>
            </div>
            <Link href="/live" className="btn btn--ghost reveal">View all live <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
          </div>
          <div className="grid grid-3 livestrip">
            {[...darshan.slice(0, 2), kathas[0]].filter(Boolean).map((item) => (
              <div key={item.id} className="temple-card reveal">
                <div className={"thumb " + (item.thumb || "tg2")}><LiveBadge /><Play /></div>
                <div className="body"><h4>{item.title}</h4><p>{item.kind === "katha" ? <Clock /> : <Pin />} {item.kind === "katha" ? (item.place + (item.subtitle ? " · " + item.subtitle : "")) : item.place}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section section--soft">
        <div className="container">
          <div className="center" style={{ marginBottom: 44 }}>
            <div className="om-divider reveal"><span>🕉</span></div>
            <h2 className="section-title reveal">Explore by category</h2>
            <p className="section-lead reveal">A treasure of devotional content — watch, listen and feel the divine.</p>
          </div>
          <div className="grid grid-3">
            {CATS.map(([title, sub, tg, ico]) => (
              <Link key={title} href="/programmes" className={"cat-tile " + tg + " reveal"}>
                <div className="ct-in"><div className="ico">{ico}</div><h3>{title}</h3><p>{sub}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Thought of the day */}
      {thought && (
        <section className="section">
          <div className="container">
            <div className="totd reveal">
              <div className="in">
                <span className="eyebrow eyebrow--light">✨ Thought of the Day</span>
                <p className="q">&ldquo;{thought.quote}&rdquo;</p>
                <p className="by">— {thought.author}</p>
                <div className="actions">
                  <button className="btn btn--wa" data-wa-share data-quote={thought.quote} data-by={thought.author}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z" /></svg>
                    Share on WhatsApp
                  </button>
                  <Link href="/about" className="btn btn--light">Get daily on your phone</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured kathakaar */}
      <section className="section section--soft">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 34 }}>
            <div>
              <span className="eyebrow reveal">🙏 Revered voices</span>
              <h2 className="section-title reveal" style={{ marginBottom: 4 }}>Featured Kathakaar</h2>
            </div>
            <Link href="/kathakaar" className="btn btn--ghost reveal">View all <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
          </div>
          <div className="grid grid-4">
            {featuredKk.map((k) => (
              <div key={k.id} className="kk-card reveal">
                <div className="kk-top"></div>
                <div className="kk-avatar"><span>{k.initials || k.name.slice(0, 2)}</span></div>
                <div className="kk-body">
                  <h3>{k.name}</h3><div className="role">{k.role}</div>
                  <div className="kk-links"><Link href="/kathakaar">Profile</Link><Link href="/programmes">Videos</Link></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilgrimage */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 44 }}>
            <div className="om-divider reveal"><span>🛕</span></div>
            <h2 className="section-title reveal">World&apos;s Pilgrim Destinations</h2>
            <p className="section-lead reveal">Journey to the most sacred sites — darshan, history and significance of each.</p>
          </div>
          <div className="grid grid-3">
            <Link href="/pilgrimage" className="pilgrim tg5 reveal"><span className="count-badge">{counts.shakti >= 51 ? "51" : counts.shakti}</span><div className="pin"><div className="kicker">Divine Feminine</div><h3>51 Shakti Peeth</h3><p><Pin /> Across India &amp; beyond</p></div></Link>
            <Link href="/pilgrimage" className="pilgrim tg1 reveal"><span className="count-badge">{counts.jyot}</span><div className="pin"><div className="kicker">Lord Shiva</div><h3>12 Jyotirling</h3><p><Pin /> The self-manifested shrines</p></div></Link>
            <Link href="/pilgrimage" className="pilgrim tg3 reveal"><span className="count-badge">100+</span><div className="pin"><div className="kicker">Sacred temples</div><h3>Famous Mandir</h3><p><Pin /> India&apos;s most revered mandirs</p></div></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--maroon">
        <div className="container">
          <div className="stat-grid">
            <div className="stat reveal"><div className="num"><span data-count={parseInt(settings.stat_live) || 100} data-suffix="+">0</span></div><div className="lbl">Live temple darshan</div></div>
            <div className="stat reveal"><div className="num"><span data-count={parseInt(settings.stat_hours) || 5000} data-suffix="+">0</span></div><div className="lbl">Hours of content</div></div>
            <div className="stat reveal"><div className="num"><span data-count={parseInt(settings.stat_artists) || 200} data-suffix="+">0</span></div><div className="lbl">Kathakaar &amp; artists</div></div>
            <div className="stat reveal"><div className="num"><span data-count={parseInt(settings.stat_langs) || 8} data-suffix="">0</span></div><div className="lbl">Regional languages</div></div>
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="section" id="app">
        <div className="container">
          <div className="app-cta reveal">
            <div>
              <h2>Carry the divine in your pocket</h2>
              <p>Download the Gyaan TV OTT app for live darshan, kathas and bhajans anytime, anywhere — with daily thought-of-the-day notifications.</p>
              <div className="store-btns">
                <a href="#" className="store-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3l16.5 9L3 21V3z"/></svg><span><small>Get it on</small><b>Google Play</b></span></a>
                <a href="#" className="store-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1 .05-2.2.68-2.9 1.5-.63.73-1.18 1.82-1 2.87 1.1.08 2.23-.55 2.9-1.38.65-.8 1.13-1.86 1-2.99zM19 17.3c-.5 1.15-.74 1.66-1.38 2.68-.9 1.42-2.17 3.19-3.74 3.2-1.4.01-1.76-.91-3.66-.9-1.9.01-2.3.92-3.7.9-1.57-.02-2.77-1.62-3.67-3.04-2.5-3.96-2.77-8.6-1.22-11.07 1.1-1.75 2.83-2.78 4.46-2.78 1.66 0 2.7.91 4.07.91 1.33 0 2.14-.91 4.06-.91 1.45 0 2.99.79 4.09 2.16-3.6 1.97-3.02 7.11.39 8.85z"/></svg><span><small>Download on the</small><b>App Store</b></span></a>
              </div>
            </div>
            <div className="app-mock">
              <div className="phone"><div className="screen">
                <div className="p-hd">🕉 Gyaan TV</div>
                <div className="p-hero"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
                <div className="p-rows"><div className="p-row"><i></i><i></i><i></i></div><div className="p-row"><i></i><i></i><i></i></div></div>
              </div></div>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
