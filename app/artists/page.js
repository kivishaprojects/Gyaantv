import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import ListingCard from "../components/ListingCard";
import Link from "next/link";
import { getServerClient, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Artists — Devotional Singers, Bhajan & Sangeet Performers",
  description: "Discover devotional artists, bhajan singers and sangeet performers on Gyaan TV. Each artist has a free mini-website with videos and contact details.",
  alternates: { canonical: "/artists" },
};

async function fetchByCategory(cat) {
  const sb = getServerClient();
  const { data } = await sb.from("gyaan_listings").select("*").eq("category", cat).eq("status", "approved").order("sort", { ascending: true });
  return data || [];
}

export default async function ArtistsPage() {
  const [settings, artists] = await Promise.all([fetchSettings(), fetchByCategory("artist")]);
  return (
    <>
      <Nav active="/artists" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Artists</div>
          <span className="eyebrow eyebrow--light">🎤 Voices of devotion</span>
          <h1>Devotional Artists</h1>
          <p>Bhajan singers, sangeet sandhya performers and devotional artists — each with their own mini-website. Are you an artist? <Link href="/list-yourself" style={{ color: "#fff", textDecoration: "underline" }}>List yourself free →</Link></p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {artists.length === 0 ? (
            <div className="admin-empty" style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", color: "#9a8b78" }}>
              No artists listed yet. <Link href="/list-yourself" style={{ color: "#a11" }}>Be the first</Link>. 🙏
            </div>
          ) : (
            <div className="grid grid-4">{artists.map((a) => <ListingCard key={a.id} item={a} />)}</div>
          )}
        </div>
      </section>
      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
