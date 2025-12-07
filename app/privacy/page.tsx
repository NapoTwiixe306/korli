import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Politique de Confidentialité | korli",
  description: "Politique de confidentialité de korli - Protection de vos données personnelles",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-block text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-black dark:text-white">
          Politique de Confidentialité
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-zinc mt-12 dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              La présente politique de confidentialité décrit la manière dont korli ("nous", "notre", "nos") 
              collecte, utilise et protège vos informations personnelles lorsque vous utilisez notre service 
              (le "Service"). En utilisant korli, vous acceptez la collecte et l'utilisation d'informations 
              conformément à cette politique.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              2. Données collectées
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
              Nous collectons les types d'informations suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong className="text-black dark:text-white">Données d'identification :</strong> nom, adresse e-mail, nom d'utilisateur</li>
              <li><strong className="text-black dark:text-white">Données de profil :</strong> bio, avatar, préférences de thème</li>
              <li><strong className="text-black dark:text-white">Données d'utilisation :</strong> statistiques de vues, clics, sources de trafic</li>
              <li><strong className="text-black dark:text-white">Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              3. Utilisation des données
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
              Nous utilisons vos données pour :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Fournir et améliorer notre Service</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Analyser l'utilisation du Service et générer des statistiques</li>
              <li>Communiquer avec vous concernant le Service</li>
              <li>Assurer la sécurité et prévenir la fraude</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              4. Partage des données
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers, 
              sauf dans les cas suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mt-4">
              <li>Avec votre consentement explicite</li>
              <li>Pour se conformer à une obligation légale</li>
              <li>Pour protéger nos droits et notre sécurité</li>
              <li>Avec des prestataires de services de confiance (hébergement, analytics) sous contrat de confidentialité</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              5. Vos droits
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong className="text-black dark:text-white">Droit d'accès :</strong> obtenir une copie de vos données</li>
              <li><strong className="text-black dark:text-white">Droit de rectification :</strong> corriger vos données inexactes</li>
              <li><strong className="text-black dark:text-white">Droit à l'effacement :</strong> supprimer vos données</li>
              <li><strong className="text-black dark:text-white">Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
              <li><strong className="text-black dark:text-white">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              6. Sécurité
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
              pour protéger vos données personnelles contre tout accès non autorisé, altération, divulgation 
              ou destruction. Cependant, aucune méthode de transmission sur Internet n'est 100% sécurisée.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              7. Conservation des données
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir le Service 
              et respecter nos obligations légales. Lorsque vous supprimez votre compte, vos données sont 
              supprimées dans un délai de 30 jours, sauf obligation légale de conservation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              8. Cookies
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Nous utilisons des cookies et technologies similaires pour améliorer votre expérience. 
              Pour plus d'informations, consultez notre{" "}
              <Link href="/cookies" className="text-black underline dark:text-white">
                Politique des cookies
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              9. Modifications
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications 
              seront publiées sur cette page avec une date de mise à jour révisée. Nous vous encourageons 
              à consulter régulièrement cette page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              10. Contact
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
              contactez-nous à{" "}
              <Link href="/contact" className="text-black underline dark:text-white">
                contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

