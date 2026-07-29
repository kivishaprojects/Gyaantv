import Link from "next/link";
import LangSwitcher from "./LangSwitcher";

const Caret = () => (
  <svg className="sub-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg>
);

// Top-level menu. Items with `sub` render a dropdown.
const MENU = [
  { label: "Home", href: "/" },
  { label: "Watch Live", href: "/live", sub: [
    ["Live Darshan", "/live#darshan"], ["Live Katha", "/live#katha"], ["Live Event", "/live#event"],
  ] },
  { label: "Programmes", href: "/programmes", sub: [
    ["Katha", "/programmes?cat=katha"], ["Dayro", "/programmes?cat=dayro"],
    ["Bhajan Sandhya", "/programmes?cat=sangeet"], ["Religious Event", "/programmes?cat=event"],
  ] },
  { label: "News", href: "/news" },
  { label: "Information", href: "/pilgrimage", sub: [
    ["Pilgrimage", "/pilgrimage"], ["Festivals", "/festivals"],
    ["Hindu Tithi Calendar", "/panchang"], ["NGO & Foundation", "/trusts"],
  ] },
  { label: "About Us", href: "/about" },
];

export default function Nav({ active }) {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand">
          <img src="/logo.svg" alt="Gyaan TV" className="brand-logo" />
        </Link>
        <ul className="nav-links">
          {MENU.map((item) => (
            <li key={item.href} className={item.sub ? "has-sub" : ""}>
              <Link href={item.href} className={active === item.href ? "active" : ""}>
                {item.label}{item.sub && <Caret />}
              </Link>
              {item.sub && (
                <ul className="subnav">
                  {item.sub.map(([label, href]) => (
                    <li key={href}><Link href={href}>{label}</Link></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="nav-lang"><LangSwitcher /></li>
          <li className="nav-cta"><Link href="/subscribe" className="btn btn--primary btn--sm">OTT App · Gift ₹1/day</Link></li>
          <li className="nav-cta"><Link href="/list-yourself" className="btn btn--ghost btn--sm">List Yourself</Link></li>
        </ul>
        <button className="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </header>
  );
}
