import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Conditions d'Utilisation | korli",
  description: "Conditions générales d'utilisation de korli",
}

export default function TermsPage() {
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
          Conditions Générales d'Utilisation
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-zinc mt-12 dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              1. Acceptation des conditions
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              En accédant et en utilisant korli (le "Service"), vous acceptez d'être lié par ces Conditions 
              Générales d'Utilisation ("CGU"). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser 
              le Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              2. Description du service
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              korli est une plateforme permettant aux utilisateurs de créer et de gérer une page de liens 
              personnalisée. Le Service inclut la création de pages, la gestion de blocs de liens, 
              l'analyse de statistiques et d'autres fonctionnalités connexes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              3. Compte utilisateur
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
              Pour utiliser le Service, vous devez :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>Créer un compte avec des informations exactes et à jour</li>
              <li>Maintenir la sécurité de votre compte et de votre mot de passe</li>
              <li>Être responsable de toutes les activités sous votre compte</li>
              <li>Avoir au moins 13 ans (ou l'âge légal dans votre juridiction)</li>
              <li>Ne pas utiliser le Service à des fins illégales ou non autorisées</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              4. Contenu utilisateur
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">
              Vous conservez tous les droits sur le contenu que vous créez et publiez via le Service. 
              En utilisant korli, vous accordez à korli une licence mondiale, non exclusive, gratuite 
              et transférable pour utiliser, reproduire, modifier et afficher votre contenu uniquement 
              dans le cadre de la fourniture du Service.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Vous vous engagez à ne pas publier de contenu qui :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mt-4">
              <li>Est illégal, nuisible, menaçant, abusif ou diffamatoire</li>
              <li>Violente les droits de propriété intellectuelle d'autrui</li>
              <li>Contient des virus ou code malveillant</li>
              <li>Est du spam ou du contenu promotionnel non autorisé</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              5. Disponibilité du service
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Nous nous efforçons de maintenir le Service disponible 24h/24 et 7j/7, mais nous ne garantissons 
              pas une disponibilité ininterrompue. Le Service peut être temporairement indisponible pour 
              maintenance, mises à jour ou raisons techniques. Nous ne serons pas responsables des dommages 
              résultant de l'indisponibilité du Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              6. Limitation de responsabilité
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Dans les limites permises par la loi, korli ne sera pas responsable des dommages directs, 
              indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité 
              d'utiliser le Service. Notre responsabilité totale ne dépassera pas le montant que vous avez 
              payé pour le Service au cours des 12 derniers mois.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              7. Propriété intellectuelle
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Le Service et son contenu original, ses fonctionnalités et sa technologie sont la propriété 
              de korli et sont protégés par les lois sur le droit d'auteur, les marques de commerce et 
              autres lois de propriété intellectuelle. Vous ne pouvez pas copier, modifier, distribuer, 
              vendre ou louer tout ou partie du Service sans notre autorisation écrite préalable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              8. Résiliation
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Vous pouvez résilier votre compte à tout moment. Nous nous réservons le droit de suspendre 
              ou de résilier votre compte si vous violez ces CGU. En cas de résiliation, votre droit d'utiliser 
              le Service cessera immédiatement, et nous pouvons supprimer votre compte et vos données.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              9. Modifications des CGU
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications entreront 
              en vigueur dès leur publication sur cette page. Votre utilisation continue du Service après 
              la publication des modifications constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              10. Droit applicable
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Ces CGU sont régies par le droit français. Tout litige relatif à ces conditions sera soumis 
              à la compétence exclusive des tribunaux français.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              11. Contact
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-7">
              Pour toute question concernant ces Conditions d'Utilisation, contactez-nous via{" "}
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

