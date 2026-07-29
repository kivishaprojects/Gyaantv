import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us — Where Devotion Meets Innovation",
  description: "Gyaan TV is building the world's most trusted digital pilgrimage ecosystem — connecting pilgrims, temples, trusts, artists and service providers on one platform.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  ["Faith First", "We respect every religion, tradition, and spiritual path with equality and integrity."],
  ["Trust & Transparency", "We are committed to providing verified information, secure transactions, and reliable services."],
  ["Innovation with Purpose", "We use modern technology to enhance spiritual experiences without compromising tradition."],
  ["Community", "We believe spirituality grows stronger when people, organizations, and communities come together."],
  ["Service", "Our purpose is to serve pilgrims by making every journey comfortable, accessible, and memorable."],
  ["Inclusivity", "We welcome people from all faiths, cultures, and backgrounds with respect and openness."],
];

const MISSION = [
  "Connecting pilgrims with temples, holy places, and spiritual destinations worldwide.",
  "Providing trusted information, bookings, and real-time updates.",
  "Supporting temples, trusts, and religious organizations with digital tools to manage devotees efficiently.",
  "Promoting spiritual tourism while preserving cultural and religious heritage.",
  "Building a transparent ecosystem for donations, volunteering, and community engagement.",
  "Using technology to make every pilgrimage safer, simpler, and more meaningful.",
];

const GOALS = [
  "Millions of Pilgrims", "Thousands of Temples & Religious Institutions", "Spiritual Organizations",
  "Ashrams & Trusts", "Tour Operators", "Hotels & Dharamshalas", "Transport Providers",
  "Volunteers", "Charitable Organizations", "Local Service Providers",
];

const Check = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>);

export default async function AboutPage() {
  const settings = await fetchSettings();
  return (
    <>
      <Nav active="/about" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / About Us</div>
          <span className="eyebrow eyebrow--light">🙏 Our story</span>
          <h1>Where Devotion Meets Innovation</h1>
          <p>We believe that every spiritual journey is more than travel—it&apos;s a life-changing experience.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <p className="about-lead">Our mission is to make every pilgrimage simple, accessible, and meaningful by bringing the entire spiritual ecosystem onto one digital platform.</p>
          <p>From ancient temples and holy cities to spiritual events, accommodations, transportation, donations, volunteer opportunities, and guided experiences, we are building a unified platform where devotees can plan, experience, and cherish every step of their journey.</p>
          <p>Our platform empowers pilgrims with trusted information, seamless booking experiences, real-time updates, and personalized spiritual guidance, while helping temples, trusts, tour operators, and service providers reach millions of devotees through one connected ecosystem.</p>
          <p>With innovation, technology, and devotion at our core, we are creating the future of pilgrimage—one that preserves tradition while embracing digital transformation.</p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="center" style={{ marginBottom: 30 }}>
            <span className="eyebrow reveal">🙏 Our Founder</span>
            <h2 className="section-title reveal">A message from the Founder</h2>
          </div>
          <div className="founder reveal">
            <div className="founder-photo" style={settings.founder_photo ? { backgroundImage: `url(${settings.founder_photo})` } : undefined}>
              {!settings.founder_photo && <span>{(settings.founder_name || "GT").slice(0, 2)}</span>}
            </div>
            <div>
              <h3>{settings.founder_name || "Founder"}</h3>
              <div className="f-role">{settings.founder_role || "Founder & Visionary"}</div>
              <p className="f-msg">&ldquo;{settings.founder_message || "Bringing the divine closer to every home."}&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="eyebrow">📿 About the Project</span>
          <h2 className="section-title">What is Gyaan TV</h2>
          <p style={{ whiteSpace: "pre-line" }}>{settings.project_about || "Gyaan TV is a unified devotional and pilgrimage platform."}</p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="eyebrow">🌏 Our Vision</span>
          <h2 className="section-title">To Become the World&apos;s Most Trusted Digital Pilgrimage Ecosystem</h2>
          <p>Our vision is to create the world&apos;s largest and most trusted platform that connects every pilgrim, temple, spiritual organization, and service provider through technology.</p>
          <p>We aspire to transform how people discover, plan, and experience spiritual journeys by making pilgrimage more accessible, organized, transparent, and enriching for everyone. By preserving cultural heritage while embracing innovation, we aim to become the global digital gateway for spiritual tourism, religious events, charitable giving, and faith-based communities.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="eyebrow">🎯 Our Mission</span>
          <h2 className="section-title">Empowering millions of pilgrims</h2>
          <p>Our mission is to empower millions of pilgrims through a secure and intelligent platform that simplifies every aspect of a spiritual journey. We are committed to:</p>
          <ul className="flist" style={{ marginTop: 18 }}>
            {MISSION.map((m) => (<li key={m}><Check /><span>{m}</span></li>))}
          </ul>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow reveal">💎 Our Core Values</span>
            <h2 className="section-title reveal">What we stand for</h2>
          </div>
          <div className="grid grid-3">
            {VALUES.map(([t, d]) => (
              <div key={t} className="value-card reveal"><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="eyebrow">🔎 Why We Exist</span>
          <h2 className="section-title">Removing the barriers to devotion</h2>
          <p>Millions of devotees travel each year seeking spiritual fulfillment, yet many still face challenges such as fragmented information, complicated planning, unreliable services, and limited digital support. We are building a platform that removes these barriers by bringing every essential pilgrimage service into one trusted destination.</p>
          <p>Whether it&apos;s finding sacred places, booking accommodations, participating in religious events, making donations, connecting with spiritual communities, or discovering nearby services, everything will be available through one seamless digital experience.</p>
        </div>
      </section>

      <section className="section section--maroon">
        <div className="container">
          <div className="center" style={{ marginBottom: 34 }}>
            <span className="eyebrow eyebrow--light reveal">🚀 Our Long-Term Goal</span>
            <h2 className="section-title reveal">The world&apos;s leading pilgrimage platform</h2>
            <p className="section-lead reveal">Connecting every part of the spiritual journey:</p>
          </div>
          <div className="goal-grid">
            {GOALS.map((g) => (<div key={g} className="goal-chip reveal">{g}</div>))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="eyebrow">🤝 Our Promise</span>
          <h2 className="section-title">Devotion, powered by technology</h2>
          <p>We promise to build a platform that combines devotion with technology, making every pilgrimage more accessible, organized, secure, and spiritually fulfilling. Our commitment is to preserve the sanctity of every sacred journey while creating digital experiences that inspire faith, strengthen communities, and connect the world through spirituality.</p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/list-yourself" className="btn btn--primary">List your temple / trust / profile</Link>
            <Link href="/subscribe" className="btn btn--ghost">Subscribe to the OTT App</Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
