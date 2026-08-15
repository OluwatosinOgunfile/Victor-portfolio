import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics";

const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://victor-portfolio-one-beta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: "Navill Tech — Business Systems That Drive Growth",
  description: "Custom web applications, automation and AI systems that save time, reduce costs and help ambitious businesses scale.",
  keywords: ["Full Stack Developer", "Business Automation", "Custom Software", "Web Applications", "AI Integration"],
  alternates: { canonical: "/" },
  icons: { icon: "/navill-mark.svg", shortcut: "/navill-mark.svg", apple: "/navill-mark.svg" },
  openGraph: {
    title: "Navill Tech — Business Systems That Drive Growth",
    description: "Replace manual work with powerful, custom-built business software.",
    type: "website",
    locale: "en_US",
    siteName: "Navill Tech",
    url: "/",
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
    url: productionUrl,
    email: "victoriyoyo2493@gmail.com",
    telephone: "+2349022301666",
    founder: { "@type": "Person", name: "Victor Tonye Iyoyo", jobTitle: "Founder and CEO" },
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
