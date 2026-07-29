import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hindu Festivals — Dates, Significance & Celebrations",
  description: "Explore major Hindu festivals — Janmashtami, Navratri, Diwali, Maha Shivratri and more — with their dates, significance and how they are celebrated.",
  alternates: { canonical: "/festivals" },
};

export default async function FestivalsPage() {
  const [settings, festivals] = await Promise.all([fetchSettings(), fetchTable("gyaan_festivals", { order: "sort" })]);
  return (
    <>
      <Nav active="/pilgrimage" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Information / Festivals</div>
          <span className="eyebrow eyebrow--light">🪔 Utsav</span>
          <h1>Hindu Festivals</h1>
          <p>The sacred festivals of Sanatan Dharma — their dates, significance and the devotion behind each celebration.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {festivals.length === 0 ? (
            <div className="admin-empty" style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", color: "#9a8b78" }}>Festival calendar coming soon. 🙏</div>
          ) : (
            <div className="grid grid-3">
              {festivals.map((f) => (
                <article key={f.id} className="fest-card reveal">
                  <div className={"fest-thumb " + (f.thumb || "tg1")} style={f.image_url ? { backgroundImage: `url(${f.image_url})` } : undefined}>
                    {(f.month || f.festival_date) && <span className="fest-when">{f.month || f.festival_date}</span>}
                  </div>
                  <div className="fest-body">
                    <h3>{f.name}</h3>
                    {f.significance && <div className="fest-sig">{f.significance}</div>}
                    {f.description && <p>{f.description}</p>}
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
