import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

const Check = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>);
const Pin = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);

export default async function AboutPage() {
  const [settings, thoughts] = await Promise.all([fetchSettings(), fetchTable("gyaan_thought", { order: "created_at" })]);
  const thought = thoughts.find((t) => t.active) || thoughts[0];
  const email = settings.contact_email || "hello@gyaantv.com";
  const phone = settings.contact_phone || "+91 90000 00000";

  return (
    <>
      <Nav active="/about" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / About</div>
          <span className="eyebrow eyebrow--light">🙏 Our mission</span>
          <h1>About Gyaan TV</h1>
          <p>A regional devotional web portal and OTT platform on a mission to bring faith, culture and the divine heritage of India to every screen.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div className="reveal">
            <span className="eyebrow">Our story</span>
            <h2 className="section-title">Faith, in your language</h2>
            <p>Gyaan TV was born from a simple belief — that devotion should be accessible to everyone, everywhere, in their own bhasha. We bring together live temple darshan, sacred kathas, soulful bhajans, traditional dayro and sangeet sandhya on a single platform.</p>
            <p style={{ marginTop: 14 }}>From revered kathakaars to the 51 Shakti Peeth and 12 Jyotirling, Gyaan TV is your companion on the path of aastha — on web and on our OTT app.</p>
            <ul className="flist" style={{ marginTop: 22 }}>
              <li><Check /><span><b>Live &amp; on-demand</b> — darshan and katha whenever you wish.</span></li>
              <li><Check /><span><b>Regional first</b> — content in 8+ Indian languages.</span></li>
              <li><Check /><span><b>Thought of the day</b> — daily wisdom, shareable on WhatsApp.</span></li>
            </ul>
          </div>
          {thought && (
            <div className="reveal">
              <div className="totd" style={{ borderRadius: 20 }}>
                <div className="in">
                  <span className="eyebrow eyebrow--light">✨ Thought of the Day</span>
                  <p className="q" style={{ fontSize: 24 }}>&ldquo;{thought.quote}&rdquo;</p>
                  <p className="by">— {thought.author}</p>
                  <div className="actions">
                    <button className="btn btn--wa" data-wa-share data-quote={thought.quote} data-by={thought.author}>
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z" /></svg>
                      Share on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section section--soft" id="app">
        <div className="container">
          <div className="app-cta reveal">
            <div>
              <h2>Download the Gyaan TV App</h2>
              <p>Live darshan, kathas and bhajans in your pocket — with daily thought-of-the-day notifications and offline favourites.</p>
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

      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow reveal">✉️ Reach us</span>
            <h2 className="section-title reveal">Get in touch</h2>
            <p className="section-lead reveal">Partnerships, katha listings or feedback — we&apos;d love to hear from you.</p>
          </div>
          <div className="contact-grid">
            <div className="reveal">
              <div className="info-card"><div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg></div><div><h4>Email</h4><a href={"mailto:" + email}>{email}</a></div></div>
              <div className="info-card"><div className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></div><div><h4>Phone</h4><a href={"tel:" + phone}>{phone}</a></div></div>
              <div className="info-card"><div className="ico"><Pin /></div><div><h4>Studio</h4><p>India</p></div></div>
            </div>
            <div className="form-card reveal">
              <div className="form-success" id="formSuccess">🙏 Thank you! Your message has been received — we&apos;ll get back to you soon.</div>
              <form id="contactForm">
                <div className="form-row">
                  <div className="field"><label htmlFor="name">Full name</label><input id="name" type="text" placeholder="Your name" required /></div>
                  <div className="field"><label htmlFor="phone">Phone</label><input id="phone" type="tel" placeholder="+91 ..." /></div>
                </div>
                <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" placeholder="you@email.com" required /></div>
                <div className="field"><label htmlFor="subject">Subject</label>
                  <select id="subject"><option value="">Select a topic</option><option>Katha / Kathakaar listing</option><option>Temple live darshan partnership</option><option>Advertising &amp; sponsorship</option><option>App support</option><option>Feedback</option><option>Other</option></select>
                </div>
                <div className="field"><label htmlFor="message">Message</label><textarea id="message" placeholder="How can we help you?" required></textarea></div>
                <button type="submit" className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
                <p className="form-note">🙏 We usually respond within one business day.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
