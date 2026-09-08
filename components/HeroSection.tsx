'use client';

import React, { useState } from 'react';
import { ArrowRight, Globe, Sparkles, AlertTriangle, Gauge, Cpu, TrendingDown, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const SAMPLE_URLS = ['stripe.com', 'airbnb.com', 'nike.com', 'hubspot.com'];

export const HeroSection: React.FC<HeroSectionProps> = ({ onAnalyze, isLoading }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setErrorMsg('Veuillez entrer une URL valide (ex: votresite.com)');
      return;
    }
    setErrorMsg('');
    onAnalyze(inputUrl.trim());
  };

  const handleSampleClick = (sample: string) => {
    setInputUrl(sample);
    setErrorMsg('');
    onAnalyze(sample);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Eyebrow Tag matching arweb.ca */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#f0ede8] border border-[#e2e0db] mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#0052cc]"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6b6b69]">
            Arweb.ca • Agence Digitale & Outil d'Audit Instantané
          </span>
        </motion.div>

        {/* Main Headline - Bricolage Grotesque */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111110] leading-[1.05] mb-6 max-w-4xl mx-auto"
        >
          Découvrez Pourquoi Votre Site Perd <span className="underline-accent text-[#0052cc]">20% à 40%</span> De Ses Prospects
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-[#6b6b69] max-w-3xl mx-auto mb-2 leading-relaxed font-light"
        >
          Audit automatique en 15 secondes : Vitesse Core Web Vitals, SEO multilingue (FR/EN/AR), cartes partagées WhatsApp & préparatif à l'indexation IA (GEO / ChatGPT).
        </motion.p>

        <p className="text-xs sm:text-sm text-[#b0ada6] italic mb-10">
          Instant 15-second diagnostic audit analyzing real mobile performance penalties and uncaptured organic revenue.
        </p>

        {/* URL Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row items-center p-2 rounded-xl bg-white border border-[#e2e0db] focus-within:border-[#0052cc] focus-within:ring-4 focus-within:ring-[#0052cc]/10 shadow-card transition-all duration-200">
              <div className="flex items-center w-full pl-3 pr-2 py-3 sm:py-0">
                <Globe className="w-5 h-5 text-[#6b6b69] mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Entrez le lien de votre site (ex: monentreprise.com)..."
                  className="w-full bg-transparent text-[#1a1a18] placeholder-[#b0ada6] text-sm sm:text-base focus:outline-none font-medium"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#111110] hover:bg-[#2a2a28] text-white font-medium text-sm sm:text-base transition-all duration-200 shadow-md flex items-center justify-center space-x-2 flex-shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Lancer l'Audit Gratuit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {errorMsg && (
            <p className="mt-2 text-xs sm:text-sm text-[#dc2626] flex items-center justify-center space-x-1 font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </p>
          )}
        </motion.div>

        {/* Sample URLs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6b6b69]"
        >
          <span className="font-medium text-[#b0ada6]">Ou testez un exemple :</span>
          {SAMPLE_URLS.map((sample) => (
            <button
              key={sample}
              onClick={() => handleSampleClick(sample)}
              disabled={isLoading}
              className="px-3 py-1 rounded-md bg-white hover:bg-[#f0ede8] border border-[#e2e0db] text-[#1a1a18] hover:text-[#0052cc] transition-colors font-mono text-[11px]"
            >
              {sample}
            </button>
          ))}
        </motion.div>

        {/* Stats Grid matching arweb.ca stats-bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 border border-[#e2e0db] rounded-xl overflow-hidden bg-white shadow-card max-w-4xl mx-auto"
        >
          <div className="p-6 text-left border-r border-b md:border-b-0 border-[#e2e0db]">
            <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111110]">
              90<span className="text-[#0052cc]">+</span>
            </div>
            <p className="text-xs text-[#6b6b69] font-medium mt-1">PageSpeed Target</p>
            <p className="text-[11px] text-[#b0ada6] mt-0.5">Mobile LCP & CLS</p>
          </div>

          <div className="p-6 text-left border-r-0 md:border-r border-b md:border-b-0 border-[#e2e0db]">
            <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111110]">
              FR<span className="text-[#0052cc]">/EN</span>
            </div>
            <p className="text-xs text-[#6b6b69] font-medium mt-1">SEO Multilingue</p>
            <p className="text-[11px] text-[#b0ada6] mt-0.5">Balises Hreflang & Lang</p>
          </div>

          <div className="p-6 text-left border-r border-[#e2e0db]">
            <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111110]">
              GEO<span className="text-[#0052cc]"> AI</span>
            </div>
            <p className="text-xs text-[#6b6b69] font-medium mt-1">Prêt pour ChatGPT</p>
            <p className="text-[11px] text-[#b0ada6] mt-0.5">Schémas JSON-LD</p>
          </div>

          <div className="p-6 text-left">
            <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111110]">
              <span className="text-[#dc2626]">-28%</span>
            </div>
            <p className="text-xs text-[#6b6b69] font-medium mt-1">Perte Moyenne</p>
            <p className="text-[11px] text-[#b0ada6] mt-0.5">Manque à gagner détecté</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
