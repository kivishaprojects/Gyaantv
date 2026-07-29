import Link from "next/link";
import LangSwitcher from "./LangSwitcher";

const LINKS = [
  ["/", "Home"],
  ["/live", "Live"],
  ["/artists", "Artists"],
  ["/kathakaar", "Kathakaar"],
  ["/directory", "Directory"],
  ["/programmes", "Programmes"],
  ["/news", "News"],
  ["/blog", "Blog"],
  ["/pilgrimage", "Pilgrimage"],
  ["/about", "About"],
];

export default function Nav({ active }) {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand">
          <img src="/logo.svg" alt="Gyaan TV" className="brand-logo" />
        </Link>
        <ul className="nav-links">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className={active === href ? "active" : ""}>
                {label}
              </Link>
            </li>
          ))}
          <li className="nav-lang"><LangSwitcher /></li>
          <li className="nav-cta"><Link href="/list-yourself" className="btn btn--ghost btn--sm">List Yourself</Link></li>
          <li className="nav-cta"><Link href="/subscribe" className="btn btn--primary btn--sm">Subscribe</Link></li>
        </ul>
        <button className="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </header>
  );
}
