import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://korli.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "korli - The Intelligent Link Identity Platform",
    template: "%s | korli",
  },
  description: "Create an adaptive, intelligent link-in-bio page that personalizes content in real time. Better than Linktree with smart blocks, analytics, and dynamic content.",
  keywords: [
    "link in bio",
    "linktree alternative",
    "bio link",
    "social media links",
    "link page",
    "smart links",
    "adaptive links",
    "personalized links",
    "link analytics",
    "social media profile",
  ],
  authors: [{ name: "korli" }],
  creator: "korli",
  publisher: "korli",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "korli",
    title: "korli - The Intelligent Link Identity Platform",
    description: "Create an adaptive, intelligent link-in-bio page that personalizes content in real time. Better than Linktree.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "korli - The Intelligent Link Identity Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "korli - The Intelligent Link Identity Platform",
    description: "Create an adaptive, intelligent link-in-bio page that personalizes content in real time.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@korli",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "korli",
      description: "The Intelligent Link Identity Platform",
      url: siteUrl,
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "150",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "korli",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      sameAs: ["https://korli.fr"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "korli",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/s/{{search_term_string}}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "korli",
      url: siteUrl,
      serviceType: "Digital link-in-bio builder and analytics",
      areaServed: "Worldwide",
    },
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: "korli Plans",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "EUR",
          description: "15 blocks, basic themes, basic analytics",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "5",
          priceCurrency: "EUR",
          description: "Unlimited blocks, advanced themes, basic smart rules, advanced analytics",
        },
        {
          "@type": "Offer",
          name: "Pro+",
          price: "12-17",
          priceCurrency: "EUR",
          description: "All smart rules, A/B testing, custom domain, advanced shortlinks, automations (later)",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: siteUrl,
        },
      ],
    },
  ]

  return (
    <html lang="fr">
      <head>
        <meta httpEquiv="Content-Language" content="fr" />
        <meta name="robots" content="index,follow,noai,noimageai" />
        <meta httpEquiv="X-Robots-Tag" content="noai,noimageai" />
        <meta name="tdm-reservation" content="1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
