import Link from 'next/link';
import { LANDING_PAGES } from '@/lib/site';

/** Internal links between the tool's pages. `current` = slug to exclude ('' for home). */
export function RelatedTools({ current }: { current: string }) {
  const links = [
    { href: '/', label: 'Audit SEO complet', desc: 'Les 7 dimensions en un seul rapport.' },
    ...LANDING_PAGES.map((p) => ({ href: `/${p.slug}`, label: p.navLabel, desc: p.description.split('.')[0] + '.' })),
  ].filter((l) => l.href !== (current ? `/${current}` : '/'));

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-medium tracking-tight text-[#202124] mb-6">
        Autres outils gratuits
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block h-full rounded-[20px] border border-[#dadce0] p-6 hover:border-[#0b57d0] hover:bg-[#f0f6ff] transition-colors"
            >
              <span className="block font-medium text-[#0b57d0] mb-1">{l.label} →</span>
              <span className="block text-sm text-[#5f6368] leading-relaxed">{l.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
