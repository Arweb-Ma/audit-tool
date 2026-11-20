import type { FaqItem } from '@/lib/site';

export function Faq({ items, heading = 'Questions fréquentes' }: { items: FaqItem[]; heading?: string }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-3xl sm:text-4xl font-medium tracking-tight text-[#202124] mb-8 text-center">
        {heading}
      </h2>
      <div className="divide-y divide-[#dadce0] border-y border-[#dadce0]">
        {items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base sm:text-lg font-medium text-[#202124]">
              <h3 className="text-base sm:text-lg font-medium">{item.q}</h3>
              <span aria-hidden className="text-[#0b57d0] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[#5f6368] leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
