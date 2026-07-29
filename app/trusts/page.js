import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import ListingCard from "../components/ListingCard";
import Link from "next/link";
import { getServerClient, fetchSettings } from "../lib/supabaseServer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trusts & NGOs — Charitable & Spiritual Organizations",
  description: "Registered trusts, NGOs and charitable spiritual organizations on Gyaan TV. List your trust free and reach devotees for seva, donations and volunteering.",
  alternates: { canonical: "/trusts" },
};

async function fetchTrusts() {
  const sb = getServerClient();
  const { data } = await sb.from("gyaan_listings").select("*").eq("category", "trust_ngo").eq("status", "approved").order("sort", { ascending: true });
  return data || [];
}

export default async function TrustsPage() {
  const [settings, trusts] = await Promise.all([fetchSettings(), fetchTrusts()]);
  return (
    <>
      <Nav active="/directory" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / Trusts &amp; NGOs</div>
          <span className="eyebrow eyebrow--light">🤝 Seva &amp; charity</span>
          <h1>Trusts &amp; NGOs</h1>
          <p>Registered trusts, ashrams and charitable organizations serving devotees through seva, annadaan and donations. Run a trust? <Link href="/list-yourself" style={{ color: "#fff", textDecoration: "underline" }}>List it free →</Link></p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {trusts.length === 0 ? (
            <div className="admin-empty" style={{ background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", color: "#9a8b78" }}>
              No trusts listed yet. <Link href="/list-yourself" style={{ color: "#a11" }}>Be the first</Link>. 🙏
            </div>
          ) : (
            <div className="grid grid-4">{trusts.map((t) => <ListingCard key={t.id} item={t} />)}</div>
          )}
        </div>
      </section>
      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
