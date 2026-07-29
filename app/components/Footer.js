import Link from "next/link";

export default function Footer({ settings = {} }) {
  const email = settings.contact_email || "hello@gyaantv.com";
  const phone = settings.contact_phone || "+91 90000 00000";
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="foot-logo"><img src="/logo.svg" alt="Gyaan TV" /></span>
            <p className="footer-about">The world&apos;s best regional devotional web portal &amp; OTT app — bringing live darshan, katha, bhajan and the divine heritage of India to your screen.</p>
            <div className="footer-social">
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.3-.4-4.8a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.4A2.5 2.5 0 0 0 1.4 7.2C1 8.7 1 12 1 12s0 3.3.4 4.8a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.4a2.5 2.5 0 0 0 1.8-1.8C23 15.3 23 12 23 12zM10 15V9l5 3-5 3z"/></svg></a>
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.3-1.5 1.6-1.5H16V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V11H7v3h2.9v8z"/></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
              <a href="#" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z"/></svg></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Watch</h5>
            <ul>
              <li><Link href="/live">Live Darshan</Link></li>
              <li><Link href="/live">Live Katha</Link></li>
              <li><Link href="/programmes">Bhajan &amp; Dayro</Link></li>
              <li><Link href="/programmes">Sangeet Sandhya</Link></li>
              <li><Link href="/programmes">Video Library</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Explore</h5>
            <ul>
              <li><Link href="/directory">Directory</Link></li>
              <li><Link href="/artists">Artists</Link></li>
              <li><Link href="/kathakaar">Kathakaars</Link></li>
              <li><Link href="/trusts">Trusts &amp; NGOs</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/subscribe">Subscribe ₹1/day</Link></li>
              <li><Link href="/list-yourself">List Yourself</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Get in touch</h5>
            <ul className="footer-contact">
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg> {email}</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg> {phone}</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg> India</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Gyaan TV. All rights reserved.</span>
          <span>Aapki Aastha, Aapki Bhasha 🙏</span>
        </div>
      </div>
    </footer>
  );
}
