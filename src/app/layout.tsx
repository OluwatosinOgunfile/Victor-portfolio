import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://victor-portfolio-seven-nu.vercel.app"),
  title: "Victor — Business Systems That Drive Growth",
  description: "Custom web applications, automation and AI systems that save time, reduce costs and help ambitious businesses scale.",
  keywords: ["Full Stack Developer", "Business Automation", "Custom Software", "Web Applications", "AI Integration"],
  openGraph: {
    title: "Victor — Business Systems That Drive Growth",
    description: "Replace manual work with powerful, custom-built business software.",
    type: "website",
    locale: "en_US",
    siteName: "Victor",
  },
  twitter: { card: "summary_large_image", title: "Victor — Business Systems That Drive Growth", description: "Custom systems built around the way your business works." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Victor — Full Stack Developer",
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
