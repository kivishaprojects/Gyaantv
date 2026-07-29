import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gyaan-tv-site.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gyaan TV — Devotional OTT, Temples, Artists, Kathakaars & Pilgrimage",
    template: "%s | Gyaan TV",
  },
  description:
    "Gyaan TV — the world's largest devotional platform. Live darshan, katha, bhajan, a directory of temples, artists, kathakaars, trusts & saints with free mini-websites, blogs, and the OTT app from ₹1/day.",
  keywords: [
    "Gyaan TV", "devotional OTT", "live darshan", "Ram Katha", "bhajan", "kathakaar",
    "temples", "artists", "trust", "NGO", "saints", "pilgrimage", "spiritual",
  ],
  applicationName: "Gyaan TV",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Gyaan TV",
    title: "Gyaan TV — World's Largest Devotional Platform",
    description: "Live darshan, katha, bhajan, a directory of temples, artists, kathakaars, trusts & saints — plus the OTT app from ₹1/day.",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "Gyaan TV", description: "World's largest devotional platform." },
  robots: { index: true, follow: true },
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gyaan TV",
    url: SITE_URL,
    description: "The world's largest devotional & pilgrimage platform.",
  };
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
