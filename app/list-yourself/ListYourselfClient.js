"use client";
import { useEffect, useState, useCallback } from "react";
import { getBrowserClient } from "../lib/supabaseClient";

const EMPTY = {
  title: "", event_type: "", organizer: "", event_date: "",
  place: "", description: "", contact_phone: "", contact_email: "", image_url: "",
};

const STATUS_LABEL = {
  pending: { t: "Pending review", c: "#b8860b", bg: "#fff6df" },
  approved: { t: "Approved — live", c: "#0a7d3c", bg: "#e6f6ec" },
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
  return <Submit supabase={supabase} session={session} />;
}

function Auth({ supabase }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: name } },
      });
      if (error) setErr(error.message);
      else if (!data.session) setMsg("Account created! Please check your email to confirm your address, then come back and sign in.");
    }
    setBusy(false);
  };

  return (
    <div className="ly-card">
      <div className="ly-tabs">
        <button className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setErr(""); setMsg(""); }}>Sign in</button>
        <button className={mode === "signup" ? "on" : ""} onClick={() => { setMode("signup"); setErr(""); setMsg(""); }}>Create account</button>
      </div>
      <p className="ly-lead">
        {mode === "login" ? "Sign in to submit and manage your events." : "Create a free account to list your events with Gyaan TV."}
      </p>
      {err && <div className="admin-err">{err}</div>}
      {msg && <div className="ly-ok">{msg}</div>}
      <form onSubmit={submit}>
        {mode === "signup" && (
          <div className="field"><label>Your name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></div>
        )}
        <div className="field"><label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
        <div className="field"><label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required /></div>
        <button className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

function Submit({ supabase, session }) {
  const [form, setForm] = useState(EMPTY);
  const [mine, setMine] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadMine = useCallback(async () => {
    const { data } = await supabase.from("gyaan_events").select("*")
      .eq("submitted_by", session.user.id).order("created_at", { ascending: false });
    setMine(data || []);
  }, [supabase, session.user.id]);

  useEffect(() => { loadMine(); }, [loadMine]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setOk(""); setBusy(true);
    const payload = {
      ...form,
      event_date: form.event_date || null,
      status: "pending",
      submitted_by: session.user.id,
      submitter_email: session.user.email,
    };
    const { error } = await supabase.from("gyaan_events").insert(payload);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setOk("🙏 Your event has been submitted! It will appear on the Events page once our team approves it.");
    setForm(EMPTY);
    loadMine();
  };

  const logout = async () => { await supabase.auth.signOut(); };

  return (
    <>
      <div className="ly-userbar">
        <span>Signed in as <b>{session.user.email}</b></span>
        <button className="mini-btn" onClick={logout}>Sign out</button>
      </div>

      <div className="ly-card">
        <h3 className="ly-h">Submit an event</h3>
        {err && <div className="admin-err">{err}</div>}
        {ok && <div className="ly-ok">{ok}</div>}
        <form onSubmit={submit}>
          <div className="field"><label>Event title *</label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Shrimad Bhagwat Katha" /></div>
          <div className="ly-row">
            <div className="field"><label>Type</label>
              <input type="text" value={form.event_type} onChange={(e) => set("event_type", e.target.value)} placeholder="Katha / Bhajan / Satsang" /></div>
            <div className="field"><label>Event date</label>
              <input type="date" value={form.event_date} onChange={(e) => set("event_date", e.target.value)} /></div>
          </div>
          <div className="ly-row">
            <div className="field"><label>Organizer</label>
              <input type="text" value={form.organizer} onChange={(e) => set("organizer", e.target.value)} placeholder="Name / Trust / Mandal" /></div>
            <div className="field"><label>Place / Venue</label>
              <input type="text" value={form.place} onChange={(e) => set("place", e.target.value)} placeholder="City, venue" /></div>
          </div>
          <div className="field"><label>Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell devotees about your event…" /></div>
          <div className="ly-row">
            <div className="field"><label>Contact phone</label>
              <input type="text" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} placeholder="+91…" /></div>
            <div className="field"><label>Contact email</label>
              <input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="optional" /></div>
          </div>
          <div className="field"><label>Poster / image URL</label>
            <input type="text" value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://… (optional)" /></div>
          <button className="btn btn--primary" style={{ justifyContent: "center" }} disabled={busy}>
            {busy ? "Submitting…" : "Submit for approval"}
          </button>
        </form>
      </div>

      <div className="ly-card">
        <h3 className="ly-h">Your submissions</h3>
        {mine.length === 0 ? (
          <p style={{ color: "#9a8b78", margin: 0 }}>You haven&apos;t submitted any events yet.</p>
        ) : (
          <div className="ly-list">
            {mine.map((ev) => {
              const s = STATUS_LABEL[ev.status] || STATUS_LABEL.pending;
              return (
                <div key={ev.id} className="ly-item">
                  <div>
                    <b>{ev.title}</b>
                    <span className="ly-item-meta">{ev.event_type || "Event"}{ev.event_date ? " · " + ev.event_date : ""}</span>
                  </div>
                  <span className="ly-status" style={{ color: s.c, background: s.bg }}>{s.t}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
