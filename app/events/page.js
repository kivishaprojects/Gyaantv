import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { getServerClient } from "../lib/supabaseServer";
import { fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch { return d; }
}

async function fetchApprovedEvents() {
  const sb = getServerClient();
  const { data } = await sb
    .from("gyaan_events")
    .select("*")
    .eq("status", "approved")
    .order("event_date", { ascending: true });
  return data || [];
}

export default async function EventsPage() {
  const [settings, events] = await Promise.all([fetchSettings(), fetchApprovedEvents()]);

  return (
    <>
      <Nav active="/events" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Events</div>
          <span className="eyebrow eyebrow--light">🗓 Community events</span>
          <h1>Devotional Events</h1>
          <p>Kathas, bhajan sandhyas, satsangs and festivals listed by the Gyaan TV community. Want to list yours?
            {" "}<Link href="/list-yourself" style={{ color: "#fff", textDecoration: "underline" }}>List your event →</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Upcoming &amp; Featured</h2>
            <Link href="/list-yourself" className="btn btn--primary">+ List your event</Link>
          </div>

          {events.length === 0 ? (
            <div className="admin-empty" style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", color: "#9a8b78" }}>
              No events published yet. Be the first — <Link href="/list-yourself" style={{ color: "#a11" }}>list your event</Link>. 🙏
            </div>
          ) : (
            <div className="grid grid-3">
              {events.map((ev) => (
                <article key={ev.id} className="event-card reveal">
                  <div
                    className="event-thumb tg3"
                    style={ev.image_url ? { backgroundImage: `url(${ev.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                  >
                    {ev.event_type && <span className="event-type">{ev.event_type}</span>}
                    {ev.event_date && <span className="event-date">{fmtDate(ev.event_date)}</span>}
                  </div>
                  <div className="event-body">
                    <h3>{ev.title}</h3>
                    {ev.place && <p className="event-place">📍 {ev.place}</p>}
                    {ev.organizer && <p className="event-org">By {ev.organizer}</p>}
                    {ev.description && <p className="event-desc">{ev.description}</p>}
                    {(ev.contact_phone || ev.contact_email) && (
                      <p className="event-contact">
                        {ev.contact_phone && <span>📞 {ev.contact_phone}</span>}
                        {ev.contact_email && <span>✉️ {ev.contact_email}</span>}
                      </p>
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
