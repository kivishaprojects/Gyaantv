"use client";
import { useEffect, useRef, useState } from "react";

// code -> native label. "en" is the site's original language.
const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "as", label: "অসমীয়া" },
  { code: "ur", label: "اردو" },
  { code: "ne", label: "नेपाली" },
  { code: "sa", label: "संस्कृतम्" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
  { code: "zh-CN", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "id", label: "Indonesia" },
];

const INCLUDED = LANGS.filter((l) => l.code !== "en").map((l) => l.code).join(",");

function readCurrent() {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "en";
}

// Build every domain scope the googtrans cookie could live on for this host.
function domainScopes() {
  const host = window.location.hostname;
  const scopes = [null, host]; // null => host-only cookie (what Google itself writes)
  const parts = host.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const d = parts.slice(i).join(".");
    scopes.push(d, "." + d);
  }
  return scopes;
}

function setGoogtrans(code) {
  const val = "/en/" + code;
  domainScopes().forEach((d) => {
    document.cookie = "googtrans=" + val + ";path=/" + (d ? ";domain=" + d : "");
  });
}

// Clear the cookie on ALL possible scopes — this is what the old version missed,
// so English never came back.
function clearGoogtrans() {
  const exp = "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  domainScopes().forEach((d) => {
    document.cookie = "googtrans" + exp + (d ? ";domain=" + d : "");
  });
}

export default function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState("en");
  const ref = useRef(null);

  useEffect(() => {
    setCur(readCurrent());
    if (!window.__gtInit) {
      window.__gtInit = true;
      window.googleTranslateElementInit = function () {
        try {
          // eslint-disable-next-line no-undef
          new google.translate.TranslateElement(
            { pageLanguage: "en", includedLanguages: INCLUDED, autoDisplay: false },
            "google_translate_element"
          );
        } catch (e) {}
      };
      const s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // Drive Google's own <select> (.goog-te-combo). Selecting the blank option
  // reliably restores the original English text — the cookie route does not.
  const applyViaCombo = (code) => {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return false;
    combo.value = code === "en" ? "" : code;
    combo.dispatchEvent(new Event("change"));
    return true;
  };

  const choose = (code) => {
    setOpen(false);
    setCur(code);
    // Keep the cookie in sync so the choice survives full page loads / navigation.
    if (code === "en") clearGoogtrans();
    else setGoogtrans(code);

    // Apply immediately in-place; retry briefly if the widget script is still loading.
    if (!applyViaCombo(code)) {
      let tries = 0;
      const iv = setInterval(() => {
        if (applyViaCombo(code) || ++tries > 25) clearInterval(iv);
      }, 120);
    }

    // Safety net: if going back to English didn't visibly revert (some Google
    // Translate builds keep a stale frame), a clean reload with the cookie
    // already cleared shows the original.
    if (code === "en") {
      setTimeout(() => {
        if (/googtrans=\/[^/]+\/(?!en)/.test(document.cookie) || document.documentElement.classList.contains("translated-ltr") || document.documentElement.classList.contains("translated-rtl")) {
          window.location.reload();
        }
      }, 700);
    }
  };

  const curLabel = (LANGS.find((l) => l.code === cur) || LANGS[0]).label;

  return (
    <div className="lang-switch notranslate" ref={ref} translate="no">
      <button className="lang-btn" onClick={() => setOpen((v) => !v)} aria-label="Change language">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
        </svg>
        <span>{curLabel}</span>
        <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="lang-menu">
          <div className="lang-menu-head">Bhasha / Language</div>
          <div className="lang-grid">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={"lang-item" + (l.code === cur ? " on" : "")}
                onClick={() => choose(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div id="google_translate_element" style={{ display: "none" }} />
    </div>
  );
}
