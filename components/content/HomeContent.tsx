const STEPS = [
  { n: '1', title: 'Entrez votre adresse', text: "Saisissez le nom de domaine de votre site (ex : monentreprise.ma). Aucune inscription n'est demandée." },
  { n: '2', title: "L'outil analyse votre page", text: 'Nous lisons le code HTML, les en-têtes HTTP, robots.txt et sitemap.xml, et interrogeons Google PageSpeed Insights en profil mobile.' },
  { n: '3', title: 'Vous obtenez votre score', text: 'Un score sur 100, le détail par catégorie et la liste des problèmes classés par gravité, avec la preuve technique pour chacun.' },
];

const CHECKS = [
  { title: 'SEO technique', weight: '30 %', text: 'Balise title (30–65 caractères), meta description (80–160), H1 unique, hiérarchie des H2, favicon.' },
  { title: 'Vitesse & Core Web Vitals', weight: '25 %', text: 'LCP, CLS, FCP, TTFB et Speed Index mesurés sur mobile via Lighthouse.' },
  { title: 'Indexabilité', weight: '15 %', text: 'Absence de noindex accidentel, canonical auto-référente, robots.txt et sitemap.xml accessibles.' },
  { title: 'Données structurées', weight: '10 %', text: 'Détection et validation des blocs JSON-LD Schema.org : Organization, LocalBusiness, WebSite, Service.' },
  { title: 'Ergonomie mobile', weight: '10 %', text: 'Viewport responsive, textes alternatifs sur les images, chargement différé (lazy-loading).' },
  { title: 'Sécurité HTTP', weight: '5 %', text: 'HTTPS, HSTS, Content-Security-Policy, X-Content-Type-Options, absence de contenu mixte.' },
  { title: 'Partage & multilingue', weight: '5 %', text: 'Balises Open Graph et Twitter/X pour les aperçus de liens, hreflang pour les sites en plusieurs langues.' },
];

export function HomeContent() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="how-heading">
        <p className="overline text-center">Comment ça marche</p>
        <h2 id="how-heading" className="text-3xl sm:text-4xl font-medium tracking-tight text-[#202124] mb-10 text-center">
          Un audit SEO gratuit en trois étapes
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-[24px] border border-[#dadce0] p-7 bg-white">
              <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-[#0b57d0] text-white font-medium mb-4">{s.n}</span>
              <h3 className="text-lg font-medium text-[#202124] mb-2">{s.title}</h3>
              <p className="text-[#5f6368] leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[#f8fafd] border-y border-[#dadce0]" aria-labelledby="checks-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="overline text-center">Ce que nous vérifions</p>
          <h2 id="checks-heading" className="text-3xl sm:text-4xl font-medium tracking-tight text-[#202124] mb-4 text-center">
            7 dimensions, un score sur 100
          </h2>
          <p className="text-center text-[#5f6368] max-w-2xl mx-auto mb-10 leading-relaxed">
            Chaque dimension est notée séparément puis pondérée selon son impact réel sur la visibilité Google et sur les conversions mobiles.
          </p>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CHECKS.map((c) => (
              <li key={c.title} className="rounded-[20px] border border-[#dadce0] bg-white p-6">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-lg font-medium text-[#202124]">{c.title}</h3>
                  <span className="text-sm font-bold text-[#0b57d0] whitespace-nowrap">{c.weight}</span>
                </div>
                <p className="text-sm text-[#5f6368] leading-relaxed">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16" aria-labelledby="method-heading">
        <p className="overline text-center">Méthodologie</p>
        <h2 id="method-heading" className="text-3xl sm:text-4xl font-medium tracking-tight text-[#202124] mb-8 text-center">
          Des mesures factuelles, pas un score marketing
        </h2>
        <div className="space-y-5 text-[#5f6368] leading-relaxed text-base sm:text-lg">
          <p>
            Beaucoup d&apos;outils d&apos;audit gonflent les problèmes pour vendre une prestation. Le nôtre applique une règle simple :
            un site techniquement sain obtient un score entre 90 et 100. Chaque pénalité correspond à une vérification précise,
            affichée avec sa preuve (la balise trouvée, l&apos;en-tête manquant, la valeur mesurée).
          </p>
          <p>
            Les mesures de vitesse proviennent de l&apos;API officielle Google PageSpeed Insights. Si elle ne répond pas, la
            pondération de la vitesse est répartie sur les autres catégories : nous n&apos;inventons jamais de valeur.
          </p>
          <p>
            L&apos;audit analyse la page d&apos;accueil telle que Google la voit. Pour un site de plusieurs dizaines de pages, un
            audit complet par un ingénieur Arweb permet de repérer les problèmes de contenu dupliqué, de maillage interne et de
            pages orphelines qu&apos;un test automatique ne peut pas couvrir.
          </p>
        </div>
      </section>
    </>
  );
}
