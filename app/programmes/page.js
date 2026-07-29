import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

const TABS = [
  ["all", "All"], ["katha", "Katha"], ["dayro", "Dayro"],
  ["sangeet", "Bhajan Sandhya"], ["bhajan", "Bhajan"], ["event", "Religious Event"], ["videos", "Videos"],
];

export default async function ProgrammesPage({ searchParams }) {
  const [settings, programmes] = await Promise.all([fetchSettings(), fetchTable("gyaan_programmes")]);
  const cat = (searchParams?.cat || "all").toLowerCase();
  const activeCat = TABS.some(([k]) => k === cat) ? cat : "all";

  return (
    <>
      <Nav active="/programmes" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Programmes</div>
          <span className="eyebrow eyebrow--light">🎬 On-demand library</span>
          <h1>Programmes &amp; Videos</h1>
          <p>Thousands of hours of devotional content — Katha, Dayro, Bhajan Sandhya and Religious Events, ready to watch anytime.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tabs">
            {TABS.map(([k, label]) => (
              <button key={k} className={"tab" + (k === activeCat ? " active" : "")} data-filter={k}>{label}</button>
            ))}
          </div>
          <div className="grid grid-4">
            {programmes.map((p) => {
              const show = activeCat === "all" || p.category === activeCat;
              return (
                <div key={p.id} className="poster reveal" data-cat={p.category} style={show ? undefined : { display: "none" }}>
                  <div className={"pthumb " + (p.thumb || "tg1")}>
                    <span className="tag">{p.tag || p.category}</span>
                    {p.duration && <span className="dur">{p.duration}</span>}
                    <div className="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></div>
                  </div>
                  <div className="pbody"><h4>{p.title}</h4><p>{p.artist}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
