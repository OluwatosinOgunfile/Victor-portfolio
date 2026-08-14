import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://victor-portfolio-seven-nu.vercel.app"),
  title: "Navill Tech — Business Systems That Drive Growth",
  description: "Custom web applications, automation and AI systems that save time, reduce costs and help ambitious businesses scale.",
  keywords: ["Full Stack Developer", "Business Automation", "Custom Software", "Web Applications", "AI Integration"],
  icons: { icon: "/navill-mark.svg", shortcut: "/navill-mark.svg", apple: "/navill-mark.svg" },
  openGraph: {
    title: "Navill Tech — Business Systems That Drive Growth",
    description: "Replace manual work with powerful, custom-built business software.",
    type: "website",
    locale: "en_US",
    siteName: "Navill Tech",
  },
  twitter: { card: "summary_large_image", title: "Navill Tech — Business Systems That Drive Growth", description: "Custom systems built around the way your business works." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Navill Tech",
    description: "Custom web applications and business automation systems.",
    areaServed: "Worldwide",
    serviceType: ["Custom Software Development", "Business Automation", "AI Integration"],
  };
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
