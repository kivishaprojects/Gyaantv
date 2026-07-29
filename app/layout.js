import "./globals.css";

export const metadata = {
  title: "Gyaan TV — Regional Devotional Web Portal & OTT App",
  description:
    "Gyaan TV — the world's best regional devotional portal & OTT app. Live Darshan, Live Katha, Kathakaar profiles, Bhajan, Dayro, Sangeet Sandhya, and India's holiest pilgrim destinations.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
