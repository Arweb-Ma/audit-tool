import type { LandingPage } from '@/lib/site';

export function LandingContent({ page }: { page: LandingPage }) {
  return (
    <>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="text-3xl sm:text-4xl font-medium tracking-tight text-[#202124] mb-6">
          {page.intro.heading}
        </h2>
        <div className="space-y-5 text-[#5f6368] leading-relaxed text-base sm:text-lg">
          {page.intro.paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </section>

      <section className="bg-[#f8fafd] border-y border-[#dadce0]" aria-label="Points vérifiés">
        <ul className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-5 sm:grid-cols-2">
          {page.points.map((pt) => (
            <li key={pt.title} className="rounded-[20px] border border-[#dadce0] bg-white p-6">
              <h3 className="text-lg font-medium text-[#202124] mb-2">{pt.title}</h3>
              <p className="text-[#5f6368] leading-relaxed">{pt.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
