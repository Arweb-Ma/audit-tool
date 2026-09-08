'use client';

import React from 'react';
import { MessageSquare, ShieldCheck, Star, Award, ArrowUpRight } from 'lucide-react';

export const AgencyCTA: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#e2e0db] pt-16 pb-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light p-8 sm:p-12 rounded-2xl border border-[#e2e0db] bg-[#f9f8f6] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#e2e0db] text-xs font-semibold text-[#0052cc]">
                <Star className="w-3.5 h-3.5 fill-[#0052cc] text-[#0052cc]" />
                <span>Arweb.ca • Agence Digitale de Croissance</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#111110] tracking-tight leading-tight">
                Transformez Votre Site Web En Une <span className="underline-accent text-[#0052cc]">Machine À Leads 24/7</span>
              </h2>

              <p className="text-sm sm:text-base text-[#6b6b69] max-w-2xl leading-relaxed">
                Nous concevons des applications web Next.js ultra-rapides, optimisées pour la recherche IA et à haut taux de conversion pour les entreprises exigeantes au Canada et à l'international.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#6b6b69] font-medium">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>Garantie Score PageSpeed 90+</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-[#0052cc]" />
                  <span>Architecture Sur-Mesure Next.js & Tailwind</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col space-y-3 justify-center">
              <a
                href="https://wa.me/212600000000?text=Bonjour%20Arweb.ca!%20Je%20souhaite%20discuter%20d'un%20projet%20de%20refonte%20ou%20d'optimisation."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-black py-4 text-sm sm:text-base rounded-md justify-center shadow-md"
              >
                <MessageSquare className="w-5 h-5 text-white" />
                <span>Discuter Sur WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </a>

              <p className="text-[11px] text-[#6b6b69] text-center font-mono">
                Visitez <a href="https://arweb.ca" target="_blank" rel="noopener noreferrer" className="text-[#0052cc] underline">arweb.ca</a> • Réponse sous 15 min
              </p>
            </div>
          </div>
        </div>

        {/* Footer Credits matching arweb.ca */}
        <div className="mt-12 pt-8 border-t border-[#e2e0db] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b6b69] gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-heading font-extrabold text-[#111110]">ARWEB.CA</span>
            <span>© 2026 Agence Digitale. Tous droits réservés.</span>
          </div>

          <div className="flex items-center space-x-6 text-[#6b6b69] font-medium">
            <a href="https://arweb.ca" target="_blank" rel="noopener noreferrer" className="hover:text-[#111110]">
              Site Officiel (arweb.ca)
            </a>
            <span>API PageSpeed V5</span>
            <span>SEO Multilingue</span>
            <span>GEO IA Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
