import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { getServerClient, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hindu Tithi Calendar — Panchang, Tithi, Nakshatra & Vrat",
  description: "Daily Hindu Tithi Calendar (Panchang) — tithi, paksha, nakshatra, festivals and vrats to plan your worship and observances.",
  alternates: { canonical: "/panchang" },
};

function parts(d) {
  try {
    const dt = new Date(d);
    return { day: dt.toLocaleDateString("en-IN", { day: "numeric" }), mon: dt.toLocaleDateString("en-IN", { month: "short" }), full: dt.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
  } catch { return { day: "", mon: "", full: d }; }
}

async function fetchPanchang() {
  const sb = getServerClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await sb.from("gyaan_panchang").select("*").gte("entry_date", today).order("entry_date", { ascending: true }).limit(60);
  return data || [];
}

export default async function PanchangPage() {
  const [settings, rows] = await Promise.all([fetchSettings(), fetchPanchang()]);
  return (
    <>
      <Nav active="/pilgrimage" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Information / Hindu Tithi Calendar</div>
          <span className="eyebrow eyebrow--light">📅 Panchang</span>
          <h1>Hindu Tithi Calendar</h1>
          <p>Daily tithi, paksha, nakshatra and vrats — to plan your fasting, worship and sacred observances.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {rows.length === 0 ? (
            <div className="admin-empty" style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", color: "#9a8b78" }}>Calendar entries coming soon. 🙏</div>
          ) : (
            <div className="panchang-list">
              {rows.map((r) => {
                const p = parts(r.entry_date);
                return (
                  <div key={r.id} className="pc-row">
                    <div className="pc-date"><div className="d">{p.day}</div><div className="m">{p.mon}</div></div>
                    <div className="pc-info">
                      <h4>{[r.tithi, r.paksha].filter(Boolean).join(" · ") || p.full}</h4>
                      <p>{[r.nakshatra && "Nakshatra: " + r.nakshatra, r.note].filter(Boolean).join(" — ") || p.full}</p>
                    </div>
                    {r.festival && <span className="pc-fest">{r.festival}</span>}
                  </div>
                );
              })}
            </div>
          )}
          <p className="form-note" style={{ margintop: 18 }}>Entries are maintained by the Gyaan TV team. A live Panchang API can be connected for automatic daily updates.</p>
        </div>
      </section>
      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
