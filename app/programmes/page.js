import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

const TABS = [
  ["all", "All"], ["katha", "Katha"], ["bhajan", "Bhajan"], ["dayro", "Dayro"],
  ["sangeet", "Sangeet Sandhya"], ["videos", "Videos"], ["other", "Other"],
];

export default async function ProgrammesPage() {
  const [settings, programmes] = await Promise.all([fetchSettings(), fetchTable("gyaan_programmes")]);

  return (
    <>
      <Nav active="/programmes" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Programmes</div>
          <span className="eyebrow eyebrow--light">🎬 On-demand library</span>
          <h1>Programmes &amp; Videos</h1>
          <p>Thousands of hours of devotional content — Katha, Bhajan, Dayro, Sangeet Sandhya and more, ready to watch anytime.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tabs">
            {TABS.map(([k, label], i) => (
              <button key={k} className={"tab" + (i === 0 ? " active" : "")} data-filter={k}>{label}</button>
            ))}
          </div>
          <div className="grid grid-4">
            {programmes.map((p) => (
              <div key={p.id} className="poster reveal" data-cat={p.category}>
                <div className={"pthumb " + (p.thumb || "tg1")}>
                  <span className="tag">{p.tag || p.category}</span>
                  {p.duration && <span className="dur">{p.duration}</span>}
                  <div className="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></div>
                </div>
                <div className="pbody"><h4>{p.title}</h4><p>{p.artist}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
