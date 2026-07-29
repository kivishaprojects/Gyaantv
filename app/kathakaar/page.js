import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

const Pin = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);
const Book = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8h14M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2M5 8l-.5 9a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2L21 8" /></svg>);

export default async function KathakaarPage() {
  const [settings, kathakaar] = await Promise.all([fetchSettings(), fetchTable("gyaan_kathakaar")]);

  return (
    <>
      <Nav active="/kathakaar" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Kathakaar</div>
          <span className="eyebrow eyebrow--light">🙏 Revered voices</span>
          <h1>Kathakaar, Maharaj &amp; Guruji</h1>
          <p>Discover revered kathakaars — their profiles, videos, ashram details and contact information, all in one place.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <div className="om-divider reveal"><span>🕉</span></div>
            <h2 className="section-title reveal">Our esteemed Kathakaars</h2>
            <p className="section-lead reveal">Tap any profile to explore their videos, images and full schedule.</p>
          </div>
          <div className="grid grid-4">
            {kathakaar.map((k) => (
              <div key={k.id} className="kk-card reveal">
                <div className="kk-top"></div>
                <div className="kk-avatar"><span>{k.initials || k.name.slice(0, 2)}</span></div>
                <div className="kk-body">
                  <h3>{k.name}</h3><div className="role">{k.role}</div>
                  <ul className="kk-meta">
                    {(k.ashram || k.place) && <li><Pin /><span>{[k.ashram, k.place].filter(Boolean).join(", ")}</span></li>}
                    {k.languages && <li><Book /><span>Languages: {k.languages}</span></li>}
                  </ul>
                  <div className="kk-links">
                    <Link href="/kathakaar">Profile</Link>
                    <Link href="/programmes">Videos</Link>
                    {k.contact_phone ? <a href={"tel:" + k.contact_phone}>Contact</a> : <Link href="/about">Contact</Link>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow reveal">🏛 Visit &amp; connect</span>
            <h2 className="section-title reveal">Ashram &amp; Contact Details</h2>
            <p className="section-lead reveal">Each kathakaar&apos;s profile includes their ashram or place details and how to reach them.</p>
          </div>
          <div className="grid grid-3" style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="info-card reveal"><div className="ico"><Pin /></div><div><h4>Ashram / Place</h4><p>Full address of the ashram or seat of each guruji, with directions.</p></div></div>
            <div className="info-card reveal"><div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></div><div><h4>Contact</h4><p>Office phone, email and booking details for katha invitations.</p></div></div>
            <div className="info-card reveal"><div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div><div><h4>Videos &amp; Images</h4><p>Curated playlists of past kathas, bhajans and photo galleries.</p></div></div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
