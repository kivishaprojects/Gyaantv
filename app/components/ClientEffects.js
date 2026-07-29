"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientEffects() {
  const pathname = usePathname();
  useEffect(() => {
    // Mobile nav
    const burger = document.querySelector(".hamburger");
    const links = document.querySelector(".nav-links");
    const onBurger = () => { burger.classList.toggle("open"); links.classList.toggle("open"); };
    if (burger && links) {
      burger.addEventListener("click", onBurger);
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => { burger.classList.remove("open"); links.classList.remove("open"); })
      );
    }

    // Scroll reveal
    const reveals = document.querySelectorAll(".reveal");
    let io;
    if ("IntersectionObserver" in window && reveals.length) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      reveals.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }
    const safety = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
      });
    }, 2200);

    // Counters
    const animate = (el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const dur = 1400; let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const val = target * (1 - Math.pow(1 - p, 3));
        el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };
    const counters = document.querySelectorAll("[data-count]");
    let co;
    if ("IntersectionObserver" in window && counters.length) {
      co = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); co.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach((c) => co.observe(c));
    }

    // Tabs
    const tabs = document.querySelectorAll(".tab");
    const tabHandlers = [];
    tabs.forEach((tab) => {
      const h = () => {
        document.querySelectorAll(".tab.active").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const cat = tab.getAttribute("data-filter");
        document.querySelectorAll("[data-cat]").forEach((item) => {
          const show = cat === "all" || item.getAttribute("data-cat") === cat;
          item.style.display = show ? "" : "none";
        });
      };
      tab.addEventListener("click", h);
      tabHandlers.push([tab, h]);
    });

    // WhatsApp share
    const waHandlers = [];
    document.querySelectorAll("[data-wa-share]").forEach((btn) => {
      const h = (e) => {
        e.preventDefault();
        const quote = btn.getAttribute("data-quote") || "";
        const by = btn.getAttribute("data-by") || "";
        const text =
          "🙏 *Thought of the Day* 🙏\n\n" + quote + (by ? "\n\n— " + by : "") +
          "\n\n📺 Powered by *Gyaan TV* — Devotional OTT\n" + window.location.origin;
        window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
      };
      btn.addEventListener("click", h);
      waHandlers.push([btn, h]);
    });

    // Contact form (demo)
    const form = document.getElementById("contactForm");
    const onSubmit = (e) => {
      e.preventDefault();
      const ok = document.getElementById("formSuccess");
      if (ok) { ok.style.display = "block"; ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
      form.reset();
    };
    if (form) form.addEventListener("submit", onSubmit);

    return () => {
      if (burger) burger.removeEventListener("click", onBurger);
      if (io) io.disconnect();
      if (co) co.disconnect();
      clearTimeout(safety);
      tabHandlers.forEach(([t, h]) => t.removeEventListener("click", h));
      waHandlers.forEach(([b, h]) => b.removeEventListener("click", h));
      if (form) form.removeEventListener("submit", onSubmit);
    };
  }, [pathname]);

  return null;
}
