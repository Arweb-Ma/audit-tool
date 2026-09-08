'use client';

import React from 'react';
import { Mail, MessageSquare, ArrowRight } from 'lucide-react';

export const AgencyCTA: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#dadce0] pt-12 pb-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blue CTA Container from main-site */}
        <div className="rounded-[28px] bg-[#0b57d0] text-white p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-[0_16px_44px_rgba(11,87,208,0.22)]">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#cbdcff]">
              Votre prochaine étape
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.08]">
              Une présence digitale plus claire commence ici.
            </h2>

            <p className="text-base sm:text-lg text-[#dbe7ff] leading-relaxed">
              Présentez-nous votre activité et votre priorité. Nous vous répondons sous 48 heures ouvrées.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="mailto:contact@arweb.ma?subject=Demande%20d'audit%20Arweb"
              className="w-full sm:w-auto button button-white min-h-[52px] px-8 text-base whitespace-nowrap"
            >
              <Mail className="w-4 h-4 mr-2" />
              <span>Demander mon audit gratuit</span>
            </a>
          </div>
        </div>

        {/* Footer Links & Credits matching main-site */}
        <div className="mt-14 pt-8 border-t border-[#dadce0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5f6368] gap-4">
          <div className="flex items-center space-x-2">
            <a href="https://arweb.ma" target="_blank" rel="noopener noreferrer" className="font-bold text-[#202124] hover:text-[#0b57d0] transition-colors">
              Arweb.ma
            </a>
            <span>· Agence digitale au Maroc et dans la région MENA.</span>
          </div>

          <div className="flex items-center space-x-6 text-[#5f6368] font-medium">
            <a href="https://arweb.ma" target="_blank" rel="noopener noreferrer" className="hover:text-[#0b57d0]">
              Site officiel
            </a>
            <a href="https://arweb.ma/blog/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0b57d0]">
              Ressources
            </a>
            <a href="mailto:contact@arweb.ma" className="hover:text-[#0b57d0]">
              contact@arweb.ma
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
