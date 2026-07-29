"use client";
import { useState } from "react";
import { getBrowserClient } from "../lib/supabaseClient";

// Uploads to the public "uploads" bucket and returns public URLs.
// Single mode: value = url string. Multi mode: value = newline-separated urls.
export default function ImageUpload({ value = "", onChange, multi = false, hint }) {
  const supabase = getBrowserClient();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const list = multi ? String(value || "").split(/\n+/).map((s) => s.trim()).filter(Boolean) : [];

  const doUpload = async (file) => {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(key, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    return supabase.storage.from("uploads").getPublicUrl(key).data.publicUrl;
  };

  const onPick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setErr("");
    try {
      if (multi) {
        const urls = [];
        for (const f of files) urls.push(await doUpload(f));
        onChange([...list, ...urls].join("\n"));
      } else {
        onChange(await doUpload(files[0]));
      }
    } catch (e2) { setErr(e2.message || "Upload failed"); }
    setBusy(false);
    e.target.value = "";
  };

  const removeAt = (i) => onChange(list.filter((_, k) => k !== i).join("\n"));

  return (
    <div className="img-up">
      {!multi && value && <div className="img-up-prev" style={{ backgroundImage: `url(${value})` }} />}
      {multi && list.length > 0 && (
        <div className="img-up-gallery">
          {list.map((u, i) => (
            <div key={i} className="img-up-thumb" style={{ backgroundImage: `url(${u})` }}>
              <button type="button" onClick={() => removeAt(i)} aria-label="Remove">×</button>
            </div>
          ))}
        </div>
      )}
      <div className="img-up-actions">
        <label className="img-up-btn">
          {busy ? "Uploading…" : multi ? "Upload photos" : (value ? "Change image" : "Upload image")}
          <input type="file" accept="image/*" multiple={multi} onChange={onPick} hidden disabled={busy} />
        </label>
        {!multi && value && <button type="button" className="mini-btn" onClick={() => onChange("")}>Remove</button>}
      </div>
      {!multi && (
        <input type="text" className="img-up-url" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" />
      )}
      {hint && <p className="img-up-hint">{hint}</p>}
      {err && <div className="admin-err" style={{ marginTop: 6 }}>{err}</div>}
    </div>
  );
}
