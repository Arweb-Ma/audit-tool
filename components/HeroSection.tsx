'use client';

import React, { useState } from 'react';
import { ArrowRight, Globe, AlertTriangle } from 'lucide-react';
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
      setErrorMsg('Veuillez entrer une adresse web valide (ex: monentreprise.ma)');
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
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden" id="audit-form">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Overline Badge */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overline"
        >
          Agence digitale · Maroc & MENA
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.045em] leading-[1.06] text-[#202124] mb-6 max-w-4xl mx-auto"
        >
          Faites de votre présence en ligne un moteur de <span className="text-[#0b57d0]">croissance.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#5f6368] max-w-2xl mx-auto mb-8 leading-relaxed font-normal"
        >
          Découvrez instantanément les freins de vitesse mobile, de SEO multilingue et d'indexation IA qui ralentissent vos conversions.
        </motion.p>

        {/* URL Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-4"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row items-center p-2 rounded-full bg-white border border-[#dadce0] focus-within:border-[#0b57d0] focus-within:ring-4 focus-within:ring-[#0b57d0]/15 shadow-sm transition-all duration-200">
              <div className="flex items-center w-full pl-4 pr-2 py-2 sm:py-0">
                <Globe className="w-5 h-5 text-[#5f6368] mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Entrez votre site web (ex: monsite.ma)..."
                  className="w-full bg-transparent text-[#202124] placeholder-[#5f6368] text-base focus:outline-none font-medium"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto button min-h-[46px] px-7 py-2.5 rounded-full text-base whitespace-nowrap shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Lancer mon audit gratuit</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {errorMsg && (
            <p className="mt-3 text-sm text-[#b3261e] flex items-center justify-center space-x-1.5 font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </p>
          )}

          <p className="text-xs text-[#5f6368] mt-3 font-normal">
            Sans engagement · Analyse instantanée des Core Web Vitals & SEO
          </p>
        </motion.div>

        {/* Sample URLs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#5f6368] mt-6"
        >
          <span className="font-medium">Ou tester un exemple :</span>
          {SAMPLE_URLS.map((sample) => (
            <button
              key={sample}
              onClick={() => handleSampleClick(sample)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-[#f0f6ff] hover:bg-[#e8f0fe] border border-[#dadce0] text-[#0b57d0] transition-colors font-medium text-xs"
            >
              {sample}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Trusted Strip from main-site */}
      <div className="trusted-strip mt-14" aria-label="Expertises principales">
        <span>Création web</span>
        <span>SEO multilingue</span>
        <span>Analytics</span>
        <span>Performance</span>
      </div>
    </section>
  );
};
