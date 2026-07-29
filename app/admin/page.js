"use client";
import { useEffect, useState, useCallback } from "react";
import { getBrowserClient } from "../lib/supabaseClient";
import { ENTITIES, ENTITY_KEYS } from "./entities";
import ImageUpload from "../components/ImageUpload";

export default function AdminPage() {
  const supabase = getBrowserClient();
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (checking) return <div className="admin-login"><div className="admin-loading" style={{ color: "#fff" }}>Loading…</div></div>;
  if (!session) return <Login supabase={supabase} />;
  return <Dashboard supabase={supabase} session={session} />;
}

function Login({ supabase }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(error.message);
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="lg"><img src="/logo.svg" alt="Gyaan TV" /></div>
        <h1>Admin Panel</h1>
        <p className="sub">Sign in to manage Gyaan TV content</p>
        {err && <div className="admin-err">{err}</div>}
        <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gyaantv.com" required /></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
        <button className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>
      </form>
    </div>
  );
}

function Dashboard({ supabase, session }) {
  const [active, setActive] = useState(ENTITY_KEYS[0]);
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // row object or {} for new
  const [error, setError] = useState("");

  const cfg = ENTITIES[active];
  const pk = cfg.pk || "id";

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error } = await supabase.from(cfg.table).select("*").order(cfg.order, { ascending: cfg.ascending !== false });
    if (error) setError(error.message);
    setRows(data || []);
    setLoading(false);
  }, [supabase, cfg.table, cfg.order, cfg.ascending]);

  const loadCounts = useCallback(async () => {
    const result = {};
    await Promise.all(ENTITY_KEYS.map(async (k) => {
      const { count } = await supabase.from(ENTITIES[k].table).select("*", { count: "exact", head: true });
      result[k] = count ?? 0;
    }));
    setCounts(result);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadCounts(); }, [loadCounts, rows.length]);

  const remove = async (row) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const { error } = await supabase.from(cfg.table).delete().eq(pk, row[pk]);
    if (error) { alert("Delete failed: " + error.message); return; }
    load();
  };

  const setStatus = async (row, status) => {
    const { error } = await supabase.from(cfg.table).update({ status }).eq(pk, row[pk]);
    if (error) { alert("Update failed: " + error.message); return; }
    load();
  };

  const logout = async () => { await supabase.auth.signOut(); };

  return (
    <div className="admin-wrap">
      <div className="admin-top">
        <div className="in">
          <div className="lft">
            <img src="/logo.svg" alt="Gyaan TV" />
            <span className="tag">Admin · {session.user.email}</span>
          </div>
          <button className="logout" onClick={logout}>Sign out</button>
        </div>
      </div>

      <div className="admin-body">
        <aside className="admin-side">
          {ENTITY_KEYS.map((k) => (
            <button key={k} className={active === k ? "active" : ""} onClick={() => setActive(k)}>
              {ENTITIES[k].label}
              <span className="count">{counts[k] ?? "·"}</span>
            </button>
          ))}
        </aside>

        <main className="admin-main">
          <div className="admin-head">
            <h2>{cfg.label}</h2>
            <button className="btn btn--primary" onClick={() => setEditing({})}>+ Add new</button>
          </div>

          {error && <div className="admin-err">{error}</div>}

          <div className="admin-card">
            {loading ? (
              <div className="admin-loading">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="admin-empty">No items yet. Click &ldquo;Add new&rdquo; to create one.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    {cfg.columns.map((c) => <th key={c}>{c.replace(/_/g, " ")}</th>)}
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row[pk]}>
                      {cfg.columns.map((c) => (
                        <td key={c}>{renderCell(row[c])}</td>
                      ))}
                      <td>
                        <div className="row-actions">
                          {(active === "events" || active === "listings") && row.status !== "approved" && (
                            <button className="mini-btn ok" onClick={() => setStatus(row, "approved")}>Approve</button>
                          )}
                          {(active === "events" || active === "listings") && row.status === "approved" && (
                            <button className="mini-btn" onClick={() => setStatus(row, "pending")}>Unpublish</button>
                          )}
                          <button className="mini-btn" onClick={() => setEditing(row)}>Edit</button>
                          <button className="mini-btn danger" onClick={() => remove(row)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {editing && (
        <EditModal
          supabase={supabase}
          cfg={cfg}
          pk={pk}
          row={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function renderCell(v) {
  if (v === true) return <span className="badge-pill">Yes</span>;
  if (v === false) return <span style={{ color: "#b09" }}></span>;
  if (v === null || v === undefined || v === "") return <span style={{ color: "#bbb" }}>—</span>;
  const s = String(v);
  return s.length > 48 ? s.slice(0, 48) + "…" : s;
}

function EditModal({ supabase, cfg, pk, row, onClose, onSaved }) {
  const isNew = !row[pk];
  const [form, setForm] = useState(() => {
    const f = {};
    cfg.fields.forEach((fl) => {
      let val = row[fl.name];
      if (val === undefined || val === null) val = fl.type === "bool" ? false : "";
      f[fl.name] = val;
    });
    return f;
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (name, val) => setForm((f) => ({ ...f, [name]: val }));

  const save = async () => {
    setBusy(true); setErr("");
    const payload = {};
    cfg.fields.forEach((fl) => {
      let v = form[fl.name];
      if (fl.type === "number") v = v === "" || v === null ? 0 : Number(v);
      if (fl.type === "bool") v = !!v;
      if (fl.type !== "bool" && fl.type !== "number" && v === "") v = null;
      // don't overwrite pk on update for settings
      if (fl.pkField && !isNew) return;
      payload[fl.name] = v;
    });

    let error;
    if (isNew) {
      ({ error } = await supabase.from(cfg.table).insert(payload));
    } else {
      ({ error } = await supabase.from(cfg.table).update(payload).eq(pk, row[pk]));
    }
    setBusy(false);
    if (error) { setErr(error.message); return; }
    onSaved();
  };

  return (
    <div className="admin-modal-bg" onClick={(e) => { if (e.target.className === "admin-modal-bg") onClose(); }}>
      <div className="admin-modal">
        <div className="m-hd">
          <h3>{isNew ? "Add " : "Edit "}{cfg.label}</h3>
          <button className="x-btn" onClick={onClose}>×</button>
        </div>
        <div className="m-bd">
          {err && <div className="admin-err">{err}</div>}
          {cfg.fields.map((fl) => {
            const disabled = fl.pkField && !isNew;
            return (
              <div className="field" key={fl.name}>
                <label>{fl.label}{fl.required && " *"}</label>
                {fl.type === "image" || fl.type === "image-multi" ? (
                  <ImageUpload value={form[fl.name] || ""} multi={fl.type === "image-multi"} onChange={(v) => set(fl.name, v)} hint={fl.hint} />
                ) : fl.type === "textarea" ? (
                  <textarea value={form[fl.name] || ""} onChange={(e) => set(fl.name, e.target.value)} />
                ) : fl.type === "bool" ? (
                  <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 400, cursor: "pointer" }}>
                    <input type="checkbox" style={{ width: "auto" }} checked={!!form[fl.name]} onChange={(e) => set(fl.name, e.target.checked)} />
                    <span style={{ fontSize: 14, color: "#7d6a58" }}>{fl.hint || "Enabled"}</span>
                  </label>
                ) : fl.type === "select" ? (
                  <select value={form[fl.name] || ""} onChange={(e) => set(fl.name, e.target.value)}>
                    {fl.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={fl.type === "number" ? "number" : fl.type === "date" ? "date" : "text"}
                    value={form[fl.name] ?? ""} disabled={disabled}
                    onChange={(e) => set(fl.name, e.target.value)} />
                )}
                {fl.hint && fl.type !== "bool" && fl.type !== "image" && fl.type !== "image-multi" && <p style={{ fontSize: 12, color: "#9a8b78", margin: "5px 2px 0" }}>{fl.hint}</p>}
              </div>
            );
          })}
        </div>
        <div className="m-ft">
          <button className="mini-btn" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
