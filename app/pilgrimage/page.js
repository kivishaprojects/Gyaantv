import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

const Pin = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);

export default async function PilgrimagePage() {
  const [settings, sites] = await Promise.all([fetchSettings(), fetchTable("gyaan_pilgrimage")]);
  const jyot = sites.filter((s) => s.category === "jyotirling");
  const mandir = sites.filter((s) => s.category === "mandir");
  const shakti = sites.filter((s) => s.category === "shakti");

  return (
    <>
      <Nav active="/pilgrimage" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Pilgrimage</div>
          <span className="eyebrow eyebrow--light">🛕 Sacred journeys</span>
          <h1>World&apos;s Pilgrim Destinations</h1>
          <p>Explore the divine geography of faith — the 51 Shakti Peeth, 12 Jyotirling and India&apos;s most famous mandirs, with darshan and significance.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <div className="pilgrim tg5 reveal" style={{ minHeight: 240 }}><span className="count-badge">51</span><div className="pin"><div className="kicker">Divine Feminine</div><h3>51 Shakti Peeth</h3><p><Pin /> Sacred seats of the Goddess</p></div></div>
            <div className="pilgrim tg1 reveal" style={{ minHeight: 240 }}><span className="count-badge">{jyot.length}</span><div className="pin"><div className="kicker">Lord Shiva</div><h3>12 Jyotirling</h3><p><Pin /> Self-manifested shrines of Shiva</p></div></div>
            <div className="pilgrim tg3 reveal" style={{ minHeight: 240 }}><span className="count-badge">100+</span><div className="pin"><div className="kicker">Sacred temples</div><h3>Famous Mandir</h3><p><Pin /> India&apos;s most revered temples</p></div></div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <div className="om-divider reveal"><span>🔱</span></div>
            <h2 className="section-title reveal">The 12 Jyotirlings</h2>
            <p className="section-lead reveal">The twelve self-manifested shrines of Lord Shiva across Bharat.</p>
          </div>
          <div className="grid grid-4">
            {jyot.map((j) => (
              <div key={j.id} className="temple-card reveal">
                <div className={"thumb " + (j.thumb || "tg1")} style={{ aspectRatio: "16/9", position: "relative" }}><span className="count-badge" style={{ position: "absolute" }}>Jyotirling</span></div>
                <div className="body"><h4>{j.name}</h4><p><Pin /> {j.place}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <div className="om-divider reveal"><span>🕉</span></div>
            <h2 className="section-title reveal">Famous Mandir</h2>
            <p className="section-lead reveal">Take darshan of the most beloved and visited temples of India.</p>
          </div>
          <div className="grid grid-4">
            {mandir.map((m) => (
              <div key={m.id} className="temple-card reveal">
                <div className={"thumb " + (m.thumb || "tg2")} style={{ aspectRatio: "16/9" }}></div>
                <div className="body"><h4>{m.name}</h4><p><Pin /> {m.place}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--maroon">
        <div className="container center">
          <div className="om-divider reveal" style={{ color: "#E7C24B" }}><span>🌸</span></div>
          <h2 className="section-title reveal">51 Shakti Peeth</h2>
          <p className="section-lead reveal" style={{ marginBottom: 8 }}>From Hinglaj in the west to Kamakhya in the east, the 51 Shakti Peeths mark where the divine energy of Maa Sati is enshrined. Explore each peeth&apos;s location, presiding deity and significance — with live darshan where available.</p>
          {shakti.length > 0 && (
            <p className="section-lead reveal" style={{ color: "#ffe9d4" }}>Featured: {shakti.map((s) => s.name).join(" · ")}</p>
          )}
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
