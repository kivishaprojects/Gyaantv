"use client";
import { useEffect, useState, useCallback } from "react";
import { getBrowserClient } from "../lib/supabaseClient";
import { slugify, CATEGORY_META } from "../lib/site";
import ImageUpload from "../components/ImageUpload";

const CATS = Object.keys(CATEGORY_META);
const EMPTY_EVENT = { title: "", event_type: "", organizer: "", event_date: "", place: "", description: "", contact_phone: "", contact_email: "", image_url: "" };
const EMPTY_LISTING = {
  category: "artist", name: "", tagline: "", about: "", image_url: "", cover_url: "", gallery: "",
  youtube_url: "", videos: "", place: "", city: "", state: "", languages: "", established: "",
  contact_phone: "", contact_email: "", website: "", facebook: "", instagram: "", youtube_channel: "",
};
const STATUS_LABEL = {
  pending: { t: "Pending review", c: "#b8860b", bg: "#fff6df" },
  approved: { t: "Live", c: "#0a7d3c", bg: "#e6f6ec" },
  rejected: { t: "Not approved", c: "#a11", bg: "#fdeaea" },
};

export default function ListYourselfClient() {
  const supabase = getBrowserClient();
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecking(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);
  if (checking) return <div className="ly-card"><p>Loading…</p></div>;
  if (!session) return <Auth supabase={supabase} />;
  return <Dashboard supabase={supabase} session={session} />;
}

function Auth({ supabase }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setMsg(""); setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) setErr(error.message);
      else if (!data.session) setMsg("Account created! Please check your email to confirm, then sign in.");
    }
    setBusy(false);
  };
  return (
    <div className="ly-card">
      <div className="ly-tabs">
        <button className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setErr(""); setMsg(""); }}>Sign in</button>
        <button className={mode === "signup" ? "on" : ""} onClick={() => { setMode("signup"); setErr(""); setMsg(""); }}>Create account</button>
      </div>
      <p className="ly-lead">Sign in to create and manage your free mini-website and events on Gyaan TV.</p>
      {err && <div className="admin-err">{err}</div>}
      {msg && <div className="ly-ok">{msg}</div>}
      <form onSubmit={submit}>
        {mode === "signup" && (<div className="field"><label>Your name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></div>)}
        <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required /></div>
        <button className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
      </form>
    </div>
  );
}

function Dashboard({ supabase, session }) {
  const [tab, setTab] = useState("listings");
  const logout = async () => { await supabase.auth.signOut(); };
  return (
    <>
      <div className="ly-userbar"><span>Signed in as <b>{session.user.email}</b></span><button className="mini-btn" onClick={logout}>Sign out</button></div>
      <div className="ly-tabs" style={{ maxWidth: 420 }}>
        <button className={tab === "listings" ? "on" : ""} onClick={() => setTab("listings")}>My Mini-Sites</button>
        <button className={tab === "events" ? "on" : ""} onClick={() => setTab("events")}>My Events</button>
      </div>
      {tab === "listings" ? <Listings supabase={supabase} session={session} /> : <Events supabase={supabase} session={session} />}
    </>
  );
}

function Listings({ supabase, session }) {
  const [mine, setMine] = useState([]);
  const [editing, setEditing] = useState(null); // listing object or {} for new or null
  const load = useCallback(async () => {
    const { data } = await supabase.from("gyaan_listings").select("*").eq("owner", session.user.id).order("created_at", { ascending: false });
    setMine(data || []);
  }, [supabase, session.user.id]);
  useEffect(() => { load(); }, [load]);

  if (editing) return <ListingForm supabase={supabase} session={session} row={editing} onDone={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;

  return (
    <>
      <div className="ly-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div><h3 className="ly-h" style={{ marginBottom: 4 }}>Your mini-websites</h3><p className="ly-lead" style={{ margin: 0 }}>Create a free page for yourself, your temple, trust, or as an artist / kathakaar.</p></div>
          <button className="btn btn--primary btn--sm" onClick={() => setEditing({})}>+ New listing</button>
        </div>
      </div>
      {mine.length === 0 ? (
        <div className="ly-card"><p style={{ color: "#9a8b78", margin: 0 }}>No listings yet. Click <b>New listing</b> to build your mini-website. 🙏</p></div>
      ) : (
        <div className="ly-card"><div className="ly-list">
          {mine.map((l) => {
            const s = STATUS_LABEL[l.status] || STATUS_LABEL.pending;
            return (
              <div key={l.id} className="ly-item">
                <div>
                  <b>{l.name}</b>
                  <span className="ly-item-meta">{(CATEGORY_META[l.category] || {}).label || l.category}{l.slug ? " · /listing/" + l.slug : ""}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {l.status === "approved" && <a className="mini-btn" href={"/listing/" + l.slug} target="_blank" rel="noreferrer">View</a>}
                  <button className="mini-btn" onClick={() => setEditing(l)}>Edit</button>
                  <span className="ly-status" style={{ color: s.c, background: s.bg }}>{s.t}</span>
                </div>
              </div>
            );
          })}
        </div></div>
      )}
    </>
  );
}

function ListingForm({ supabase, session, row, onDone, onCancel }) {
  const isNew = !row.id;
  const [form, setForm] = useState(() => ({ ...EMPTY_LISTING, ...row }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    const payload = { ...form };
    delete payload.status; delete payload.owner; delete payload.created_at; delete payload.id;
    if (isNew) {
      payload.slug = slugify(form.name) + "-" + Math.random().toString(36).slice(2, 6);
      payload.submitter_email = session.user.email;
      const { error } = await supabase.from("gyaan_listings").insert(payload);
      if (error) { setErr(error.message); setBusy(false); return; }
    } else {
      const { error } = await supabase.from("gyaan_listings").update(payload).eq("id", row.id);
      if (error) { setErr(error.message); setBusy(false); return; }
    }
    setBusy(false); onDone();
  };

  return (
    <div className="ly-card">
      <h3 className="ly-h">{isNew ? "Create your mini-website" : "Edit mini-website"}</h3>
      <p className="ly-lead">Once you save, our team reviews it and it goes live at your own page. You can edit anytime.</p>
      {err && <div className="admin-err">{err}</div>}
      <form onSubmit={save}>
        <div className="ly-row">
          <div className="field"><label>Type *</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATS.map((c) => <option key={c} value={c}>{CATEGORY_META[c].label}</option>)}
            </select>
          </div>
          <div className="field"><label>Name *</label><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Full name / temple / trust" /></div>
        </div>
        <div className="field"><label>Tagline</label><input type="text" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Ram Katha & Bhagwat" /></div>
        <div className="field"><label>About</label><textarea value={form.about} onChange={(e) => set("about", e.target.value)} placeholder="Tell devotees about yourself / your organization…" /></div>
        <div className="ly-row">
          <div className="field"><label>Photo / Logo</label><ImageUpload value={form.image_url} onChange={(v) => set("image_url", v)} hint="Your profile photo or logo" /></div>
          <div className="field"><label>Cover / Website banner</label><ImageUpload value={form.cover_url} onChange={(v) => set("cover_url", v)} hint="Wide banner across the top of your page" /></div>
        </div>
        <div className="field"><label>Photo gallery</label><ImageUpload value={form.gallery} onChange={(v) => set("gallery", v)} multi hint="Upload multiple photos" /></div>
        <div className="field"><label>Main YouTube link</label><input type="text" value={form.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} placeholder="https://youtube.com/watch?v=…" /></div>
        <div className="field"><label>More YouTube links</label><textarea value={form.videos} onChange={(e) => set("videos", e.target.value)} placeholder="One link per line" /></div>
        <div className="ly-row">
          <div className="field"><label>Place / Ashram</label><input type="text" value={form.place} onChange={(e) => set("place", e.target.value)} /></div>
          <div className="field"><label>City</label><input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
        </div>
        <div className="ly-row">
          <div className="field"><label>State</label><input type="text" value={form.state} onChange={(e) => set("state", e.target.value)} /></div>
          <div className="field"><label>Languages</label><input type="text" value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="Hindi, Gujarati…" /></div>
        </div>
        <div className="ly-row">
          <div className="field"><label>Contact phone</label><input type="text" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} /></div>
          <div className="field"><label>Contact email</label><input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></div>
        </div>
        <div className="ly-row">
          <div className="field"><label>Website</label><input type="text" value={form.website} onChange={(e) => set("website", e.target.value)} /></div>
          <div className="field"><label>YouTube channel</label><input type="text" value={form.youtube_channel} onChange={(e) => set("youtube_channel", e.target.value)} /></div>
        </div>
        <div className="ly-row">
          <div className="field"><label>Facebook</label><input type="text" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} /></div>
          <div className="field"><label>Instagram</label><input type="text" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} /></div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="mini-btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn--primary" style={{ justifyContent: "center" }} disabled={busy}>{busy ? "Saving…" : isNew ? "Submit mini-website" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}

function Events({ supabase, session }) {
  const [form, setForm] = useState(EMPTY_EVENT);
  const [mine, setMine] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const loadMine = useCallback(async () => {
    const { data } = await supabase.from("gyaan_events").select("*").eq("submitted_by", session.user.id).order("created_at", { ascending: false });
    setMine(data || []);
  }, [supabase, session.user.id]);
  useEffect(() => { loadMine(); }, [loadMine]);
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setOk(""); setBusy(true);
    const payload = { ...form, event_date: form.event_date || null, status: "pending", submitted_by: session.user.id, submitter_email: session.user.email };
    const { error } = await supabase.from("gyaan_events").insert(payload);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setOk("🙏 Event submitted! It appears on the Events page once approved.");
    setForm(EMPTY_EVENT); loadMine();
  };
  return (
    <>
      <div className="ly-card">
        <h3 className="ly-h">Submit an event</h3>
        {err && <div className="admin-err">{err}</div>}
        {ok && <div className="ly-ok">{ok}</div>}
        <form onSubmit={submit}>
          <div className="field"><label>Event title *</label><input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Shrimad Bhagwat Katha" /></div>
          <div className="ly-row">
            <div className="field"><label>Type</label><input type="text" value={form.event_type} onChange={(e) => set("event_type", e.target.value)} placeholder="Katha / Bhajan" /></div>
            <div className="field"><label>Event date</label><input type="date" value={form.event_date} onChange={(e) => set("event_date", e.target.value)} /></div>
          </div>
          <div className="ly-row">
            <div className="field"><label>Organizer</label><input type="text" value={form.organizer} onChange={(e) => set("organizer", e.target.value)} /></div>
            <div className="field"><label>Place / Venue</label><input type="text" value={form.place} onChange={(e) => set("place", e.target.value)} /></div>
          </div>
          <div className="field"><label>Description</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="ly-row">
            <div className="field"><label>Contact phone</label><input type="text" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} /></div>
            <div className="field"><label>Contact email</label><input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></div>
          </div>
          <button className="btn btn--primary" style={{ justifyContent: "center" }} disabled={busy}>{busy ? "Submitting…" : "Submit for approval"}</button>
        </form>
      </div>
      <div className="ly-card">
        <h3 className="ly-h">Your events</h3>
        {mine.length === 0 ? (<p style={{ color: "#9a8b78", margin: 0 }}>No events submitted yet.</p>) : (
          <div className="ly-list">
            {mine.map((ev) => { const s = STATUS_LABEL[ev.status] || STATUS_LABEL.pending; return (
              <div key={ev.id} className="ly-item"><div><b>{ev.title}</b><span className="ly-item-meta">{ev.event_type || "Event"}{ev.event_date ? " · " + ev.event_date : ""}</span></div><span className="ly-status" style={{ color: s.c, background: s.bg }}>{s.t}</span></div>
            ); })}
          </div>
        )}
      </div>
    </>
  );
}
