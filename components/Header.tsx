'use client';

import React from 'react';
import { ArrowUpRight, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  onDirectConsultation?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#f9f8f6]/95 backdrop-blur-md border-b border-[#e2e0db]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Arweb.ca style */}
        <a href="https://arweb.ca" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 group">
          <div className="font-heading font-extrabold text-2xl tracking-tight text-[#111110] flex items-center">
            Arweb<span className="text-[#0052cc]">.ca</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-[#e8f0ff] text-[#0052cc] border border-[#0052cc]/20">
            AUDIT TOOL
          </span>
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm text-[#6b6b69] font-medium">
          <a href="https://arweb.ca" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a18] transition-colors">
            Services
          </a>
          <a href="https://arweb.ca" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a18] transition-colors">
            Notre Approche
          </a>
          <a href="https://arweb.ca" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a18] transition-colors">
            Réalisations
          </a>
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#f0ede8] border border-[#e2e0db] text-[#111110] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            <span>PageSpeed V5 & GEO AI</span>
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <a
            href="https://wa.me/212600000000?text=Bonjour%20l'équipe%20Arweb.ca!%20Je%20souhaite%20un%20audit%20de%20performance%20et%20de%20conversion."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-black text-xs sm:text-sm px-4 py-2.5 rounded-md hover:bg-[#2a2a28] transition-all flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Parler à un Stratège</span>
            <span className="sm:hidden">WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
};
