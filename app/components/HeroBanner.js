"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroBanner({ slides = [] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  if (!n) return null;

  return (
    <section className="home-banner">
      <div className="hb-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s) => {
          const hasImg = s.image_url && s.image_url.trim() !== "";
          const external = s.cta_link && /^https?:\/\//.test(s.cta_link);
          return (
            <div
              key={s.id}
              className={"hb-slide" + (hasImg ? " has-img" : "")}
              style={hasImg ? { backgroundImage: `linear-gradient(90deg, rgba(60,12,12,.82), rgba(60,12,12,.35)), url(${s.image_url})` } : undefined}
            >
              <div className="container hb-inner">
                {s.eyebrow && <span className="hb-eyebrow">{s.eyebrow}</span>}
                {s.title && <h2 className="hb-title">{s.title}</h2>}
                {s.subtitle && <p className="hb-sub">{s.subtitle}</p>}
                {s.cta_label && s.cta_link && (
                  external ? (
                    <a href={s.cta_link} className="btn btn--light hb-btn" target="_blank" rel="noreferrer">{s.cta_label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </a>
                  ) : (
                    <Link href={s.cta_link} className="btn btn--light hb-btn">{s.cta_label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </Link>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
      {n > 1 && (
        <div className="hb-dots">
          {slides.map((s, k) => (
            <button key={s.id} aria-label={"Slide " + (k + 1)} className={k === i ? "on" : ""} onClick={() => setI(k)} />
          ))}
        </div>
      )}
    </section>
  );
}
