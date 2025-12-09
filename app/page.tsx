import type { Metadata } from "next"
import { Footer } from "./components/landing/footer"
import { Navbar } from "./components/landing/navbar"
import { LandingSections } from "./components/landing/sections"

const siteUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://korli.fr"

export const metadata: Metadata = {
  title: "korli - Votre page de liens intelligente et adaptative",
  description: "Créez une page de liens qui s'adapte à chaque visiteur. Design personnalisable, analytics gratuits, shortlinks intégrés.",
  keywords: [
    "page de liens",
    "link in bio",
    "lien bio",
    "linktree alternative",
    "page liens",
    "liens bio",
    "créateur contenu",
    "influenceur",
    "réseaux sociaux",
    "analytics liens",
    "shortlinks",
  ],
  openGraph: {
    title: "korli - Votre page de liens intelligente et adaptative",
    description: "Créez une page de liens qui s'adapte à chaque visiteur. Analytics gratuits, design personnalisable, shortlinks intégrés.",
    url: siteUrl,
    siteName: "korli",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "korli - Votre page de liens intelligente",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "korli - Votre page de liens intelligente et adaptative",
    description: "Créez une page de liens qui s'adapte à chaque visiteur. Analytics gratuits, design personnalisable.",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
}

/**
 * Landing page component.
 * 
 * Main entry point for the public website.
 * Composed of Navbar, LandingSections, and Footer.
 */
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "korli",
    url: siteUrl,
    description: "Plateforme de liens intelligente qui s'adapte à chaque visiteur",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    featureList: [
      "Analytics gratuits",
      "Design personnalisable",
      "Shortlinks intégrés",
      "SEO optimisé",
      "Layouts variés",
      "Blocs par défaut",
    ],
    potentialAction: {
      "@type": "RegisterAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/register`,
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <main>
          <LandingSections />
        </main>
        <Footer />
      </div>
    </>
  )
}
