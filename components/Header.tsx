'use client';

import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  onDirectConsultation?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="h-[76px] sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dadce0] flex items-center justify-between px-4 sm:px-8 lg:px-16 transition-all">
      {/* Brand Logo - Official SVG from main-site */}
      <a href="https://arweb.ma" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3" aria-label="Arweb — accueil">
        <img src="/logo.svg" width={144} height={40} alt="Arweb" className="h-9 w-auto" />
      </a>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-[#202124] font-medium" aria-label="Navigation principale">
        <a href="https://arweb.ma/#solutions" target="_blank" rel="noopener noreferrer" className="hover:text-[#0b57d0] transition-colors">
          Solutions
        </a>
        <a href="https://arweb.ma/blog/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0b57d0] transition-colors">
          Ressources
        </a>
        <a href="https://arweb.ma/#methode" target="_blank" rel="noopener noreferrer" className="hover:text-[#0b57d0] transition-colors">
          Notre méthode
        </a>
        <a href="https://arweb.ma/#engagements" target="_blank" rel="noopener noreferrer" className="hover:text-[#0b57d0] transition-colors">
          Pourquoi Arweb
        </a>
        <a href="https://arweb.ma/#faq" target="_blank" rel="noopener noreferrer" className="hover:text-[#0b57d0] transition-colors">
          FAQ
        </a>
      </nav>

      {/* CTA Button */}
      <div className="flex items-center gap-3">
        <a
          href="#audit-form"
          className="button button-compact font-bold text-sm"
        >
          Audit gratuit
        </a>
      </div>
    </header>
  );
};
