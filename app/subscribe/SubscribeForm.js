"use client";
import { useState } from "react";
import { getBrowserClient } from "../lib/supabaseClient";

export default function SubscribeForm({ priceYear = "365", priceDay = "1", upi = "", payLink = "" }) {
  const supabase = getBrowserClient();
  const [plan, setPlan] = useState("gift_1_day");
  const [form, setForm] = useState({ name: "", phone: "", email: "", gift_for: "" });
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await supabase.from("gyaan_subscriptions").insert({
      ...form, plan, amount: Number(priceYear) || 365, status: "new",
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setOk(true);
  };

  return (
    <div className="sub-wrap">
      <div className="sub-plans">
        <button type="button" className={"sub-plan" + (plan === "gift_1_day" ? " on" : "")} onClick={() => setPlan("gift_1_day")}>
          <span className="sub-eyebrow">🎁 Gift a Year</span>
          <div className="sub-price">₹{priceDay}<small>/day</small></div>
          <p>Gift the OTT App to your mother, father or elders — just ₹{priceDay} a day for a full year (₹{priceYear}).</p>
        </button>
        <button type="button" className={"sub-plan" + (plan === "annual_365" ? " on" : "")} onClick={() => setPlan("annual_365")}>
          <span className="sub-eyebrow">📺 Annual Plan</span>
          <div className="sub-price">₹{priceYear}<small>/year</small></div>
          <p>Full year of live darshan, katha, bhajan &amp; the entire on-demand devotional library.</p>
        </button>
      </div>

      {ok ? (
        <div className="ly-ok" style={{ marginTop: 8 }}>
          🙏 Thank you! Your subscription request is received.{" "}
          {payLink ? <>Complete payment here: <a href={payLink} target="_blank" rel="noreferrer">{payLink}</a>.</> :
            upi ? <>Please pay ₹{priceYear} to UPI <b>{upi}</b> and our team will activate your subscription.</> :
            <>Our team will contact you shortly to activate it.</>}
        </div>
      ) : (
        <form className="sub-form" onSubmit={submit}>
          {err && <div className="admin-err">{err}</div>}
          <div className="ly-row">
            <div className="field"><label>Your name</label><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
            <div className="field"><label>Phone / WhatsApp</label><input type="text" value={form.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="+91…" /></div>
          </div>
          <div className="ly-row">
            <div className="field"><label>Email (optional)</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
            {plan === "gift_1_day" && (
              <div className="field"><label>Gift for (name)</label><input type="text" value={form.gift_for} onChange={(e) => set("gift_for", e.target.value)} placeholder="e.g. Maa / Papa" /></div>
            )}
          </div>
          <button className="btn btn--primary" style={{ justifyContent: "center", width: "100%" }} disabled={busy}>
            {busy ? "Please wait…" : plan === "gift_1_day" ? `Gift for ₹${priceDay}/day →` : `Subscribe for ₹${priceYear}/year →`}
          </button>
          <p className="form-note">You&apos;ll receive activation details after submitting. 🙏</p>
        </form>
      )}
    </div>
  );
}
