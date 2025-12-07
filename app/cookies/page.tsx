import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Politique des Cookies | korli",
  description: "Politique d'utilisation des cookies sur korli",
}

export default function CookiesPage() {
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
          Politique des Cookies
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-zinc mt-12 dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              1. Qu'est-ce qu'un cookie ?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) 
              lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et 
              préférences pendant une période donnée, évitant ainsi de devoir les ressaisir à chaque visite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              2. Comment utilisons-nous les cookies ?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
              korli utilise les cookies pour :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong className="text-black dark:text-white">Authentification :</strong> maintenir votre session connectée</li>
              <li><strong className="text-black dark:text-white">Préférences :</strong> mémoriser vos choix (thème sombre/clair, langue)</li>
              <li><strong className="text-black dark:text-white">Analytics :</strong> analyser l'utilisation du site pour l'améliorer</li>
              <li><strong className="text-black dark:text-white">Sécurité :</strong> protéger contre les activités frauduleuses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              3. Types de cookies utilisés
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Cookies essentiels
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                Ces cookies sont nécessaires au fonctionnement du Service. Ils permettent l'authentification, 
                la sécurité et la navigation de base. Sans ces cookies, certaines fonctionnalités ne peuvent 
                pas être fournies.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Cookies de préférences
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                Ces cookies mémorisent vos choix (thème, langue) pour personnaliser votre expérience. 
                Ils ne sont pas essentiels mais améliorent votre utilisation du Service.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Cookies analytiques
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                Ces cookies nous aident à comprendre comment les visiteurs utilisent le Service en collectant 
                des informations anonymes. Ils nous permettent d'améliorer le Service et l'expérience utilisateur.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              4. Durée de conservation
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
              Les cookies que nous utilisons ont différentes durées de vie :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong className="text-black dark:text-white">Cookies de session :</strong> supprimés à la fermeture du navigateur</li>
              <li><strong className="text-black dark:text-white">Cookies persistants :</strong> conservés jusqu'à 12 mois maximum</li>
              <li><strong className="text-black dark:text-white">Cookies d'authentification :</strong> conservés jusqu'à 7 jours</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              5. Gestion des cookies
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
              Vous pouvez contrôler et gérer les cookies de plusieurs façons :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong className="text-black dark:text-white">Paramètres du navigateur :</strong> la plupart des navigateurs vous permettent de refuser ou d'accepter les cookies</li>
              <li><strong className="text-black dark:text-white">Suppression :</strong> vous pouvez supprimer les cookies déjà stockés sur votre appareil</li>
              <li><strong className="text-black dark:text-white">Notification :</strong> votre navigateur peut vous avertir avant qu'un cookie ne soit stocké</li>
            </ul>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mt-4">
              <strong className="text-black dark:text-white">Note importante :</strong> La désactivation des cookies essentiels peut affecter 
              le fonctionnement du Service et certaines fonctionnalités peuvent ne plus être disponibles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              6. Cookies tiers
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Actuellement, korli n'utilise pas de cookies tiers. Si cela change à l'avenir, nous mettrons 
              à jour cette politique et vous en informerons. Nous ne partageons pas vos données de cookies 
              avec des tiers à des fins publicitaires.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              7. Modifications
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Nous pouvons modifier cette politique des cookies à tout moment pour refléter les changements 
              dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. 
              La date de la dernière mise à jour est indiquée en haut de cette page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              8. Contact
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Pour toute question concernant notre utilisation des cookies, contactez-nous via{" "}
              <Link href="/contact" className="text-black underline dark:text-white">
                notre page de contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

