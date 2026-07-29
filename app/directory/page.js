import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import ListingCard from "../components/ListingCard";
import Link from "next/link";
import { fetchTable, fetchSettings } from "../lib/supabaseServer";
import { CATEGORY_META } from "../lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Directory — Temples, Artists, Kathakaars, Trusts & Saints",
  description: "Explore the Gyaan TV directory: temples, artists, kathakaars, trusts & NGOs, saints, rishis and religious personalities — each with their own mini-website.",
  alternates: { canonical: "/directory" },
};

const CATS = Object.keys(CATEGORY_META);

export default async function DirectoryPage() {
  const [settings, listings] = await Promise.all([fetchSettings(), fetchTable("gyaan_listings", { order: "sort" })]);
  const present = CATS.filter((c) => listings.some((l) => l.category === c));

  return (
    <>
      <Nav active="/directory" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Directory</div>
          <span className="eyebrow eyebrow--light">🔆 The living heritage of Bharat</span>
          <h1>Devotional Directory</h1>
          <p>The world&apos;s largest database of Temples, Artists, Kathakaars, Trusts &amp; NGOs, Saints, Rishis and religious personalities — each with a free mini-website. <Link href="/list-yourself" style={{ color: "#fff", textDecoration: "underline" }}>List yourself →</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {present.length > 1 && (
            <div className="tabs">
              <button className="tab active" data-filter="all">All</button>
              {present.map((c) => (
                <button key={c} className="tab" data-filter={c}>{CATEGORY_META[c].icon} {CATEGORY_META[c].plural}</button>
              ))}
            </div>
          )}
          {listings.length === 0 ? (
            <div className="admin-empty" style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", color: "#9a8b78" }}>
              No listings yet. <Link href="/list-yourself" style={{ color: "#a11" }}>Be the first to list</Link>. 🙏
            </div>
          ) : (
            <div className="grid grid-4">
              {listings.map((item) => (
                <div key={item.id} data-cat={item.category}><ListingCard item={item} /></div>
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
