import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ClientEffects from "../components/ClientEffects";
import Link from "next/link";
import { fetchSettings } from "../lib/supabaseServer";
import ListYourselfClient from "./ListYourselfClient";

export const dynamic = "force-dynamic";

export default async function ListYourselfPage() {
  const settings = await fetchSettings();
  return (
    <>
      <Nav active="/events" />
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / List Yourself</div>
          <span className="eyebrow eyebrow--light">🙏 List yourself with Gyaan TV</span>
          <h1>List Your Event</h1>
          <p>Organising a katha, bhajan sandhya, satsang or festival? Create a free account, submit your event, and once our team approves it, it goes live on the Gyaan TV Events page.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <ListYourselfClient />
        </div>
      </section>

      <Footer settings={settings} />
      <ClientEffects />
    </>
  );
}
