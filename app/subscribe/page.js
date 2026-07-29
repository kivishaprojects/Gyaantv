import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchSettings } from "../lib/supabaseServer";
import SubscribeForm from "./SubscribeForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subscribe — Gyaan TV OTT App from ₹1/day (₹365/year)",
  description: "Gift the Gyaan TV OTT App to your mother, father or elders for just ₹1/day — a full year of live darshan, katha and bhajan for only ₹365.",
  alternates: { canonical: "/subscribe" },
};

export default async function SubscribePage() {
  const s = await fetchSettings();
  const priceYear = s.sub_price_year || "365";
  const priceDay = s.sub_price_day || "1";

  return (
    <>
      <Nav active="/subscribe" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Subscribe</div>
          <span className="eyebrow eyebrow--light">🎁 The Gift of Devotion</span>
          <h1>Gift a Year of Darshan for ₹{priceDay}/day</h1>
          <p>Give your mother, father and elders the gift of daily live darshan, katha and bhajan — just ₹{priceDay} a day. A full year of the Gyaan TV OTT App for only ₹{priceYear}.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <SubscribeForm priceYear={priceYear} priceDay={priceDay} upi={s.sub_upi_id || ""} payLink={s.sub_payment_link || ""} />

          <div className="sub-feats">
            <div className="sub-feat"><b>📺 100+ Live Darshan</b><span>Temples across India, live every day.</span></div>
            <div className="sub-feat"><b>🎙 Kathas &amp; Bhajans</b><span>Thousands of hours, on demand.</span></div>
            <div className="sub-feat"><b>✨ Daily Thought</b><span>Wisdom delivered every morning.</span></div>
            <div className="sub-feat"><b>📱 All Devices</b><span>Watch on mobile, tablet &amp; TV.</span></div>
          </div>
        </div>
      </section>

      <Footer settings={s} />
      <ClientEffects />
    </>
  );
}
