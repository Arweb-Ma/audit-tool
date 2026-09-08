'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Globe, Cpu, Languages, TrendingDown, Sparkles } from 'lucide-react';

interface AuditProgressModalProps {
  isOpen: boolean;
  targetUrl: string;
}

const AUDIT_STEPS = [
  {
    id: 1,
    title: 'Extraction DOM & Analyse des Métadonnées',
    description: 'Vérification de la structure HTML, des cartes OpenGraph, du viewport mobile & temps de réponse HTTP...',
    icon: Globe,
  },
  {
    id: 2,
    title: 'Analyse Vitesse Mobile & Core Web Vitals',
    description: 'Interrogation de l\'API Google PageSpeed V5 pour LCP, CLS, FCP & premier octet (TTFB)...',
    icon: Cpu,
  },
  {
    id: 3,
    title: 'Vérification SEO Multilingue & Indexation IA (GEO)',
    description: 'Évaluation des objets structurés JSON-LD, balises hreflang FR/EN & visibilité ChatGPT Search...',
    icon: Languages,
  },
  {
    id: 4,
    title: 'Calcul de l\'Impact sur le Chiffre d\'Affaires',
    description: 'Traduction des lenteurs et manques SEO en perte de conversion et opportunités manquées...',
    icon: TrendingDown,
  },
];

export const AuditProgressModal: React.FC<AuditProgressModalProps> = ({ isOpen, targetUrl }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPct, setProgressPct] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgressPct(5);
      return;
    }

    const interval = setInterval(() => {
      setProgressPct((prev) => (prev >= 95 ? 95 : prev + 1));
    }, 60);

    const step1Timer = setTimeout(() => setCurrentStepIndex(1), 1400);
    const step2Timer = setTimeout(() => setCurrentStepIndex(2), 3200);
    const step3Timer = setTimeout(() => setCurrentStepIndex(3), 4800);

    return () => {
      clearInterval(interval);
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = AUDIT_STEPS[currentStepIndex] || AUDIT_STEPS[AUDIT_STEPS.length - 1];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111110]/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e0db] shadow-modal relative text-[#1a1a18]"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0ff] border border-[#0052cc]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#0052cc] animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#111110]">
                Moteur d'Audit Arweb.ca Actif
              </h3>
              <p className="text-xs text-[#6b6b69] font-mono truncate max-w-[320px] sm:max-w-md">
                Analyse de : <span className="text-[#0052cc] font-semibold">{targetUrl}</span>
              </p>
            </div>
          </div>

          {/* Progress Radar Box */}
          <div className="relative my-6 py-6 flex flex-col items-center justify-center bg-[#f9f8f6] rounded-xl border border-[#e2e0db] overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-[#0052cc] shadow-md flex items-center justify-center mb-2">
                {React.createElement(currentStep.icon, { className: 'w-7 h-7 text-[#0052cc] animate-pulse' })}
              </div>
              <p className="font-heading text-3xl font-extrabold text-[#111110]">{progressPct}%</p>
              <p className="text-xs text-[#6b6b69] uppercase tracking-widest mt-0.5 font-semibold">Diagnostic en cours</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#e8e6e1] rounded-full h-2 mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-[#0052cc] rounded-full"
              initial={{ width: '5%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Step List */}
          <div className="space-y-2.5">
            {AUDIT_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-start space-x-3 p-3 rounded-xl border transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#e8f0ff] border-[#0052cc]/40'
                      : isCompleted
                      ? 'bg-white border-[#e2e0db]'
                      : 'bg-[#f9f8f6] border-[#e2e0db] opacity-60'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#0052cc] animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#b0ada6] flex items-center justify-center text-[10px] text-[#6b6b69] font-mono">
                        {step.id}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs sm:text-sm font-semibold ${
                          isCurrent ? 'text-[#0052cc]' : isCompleted ? 'text-[#111110]' : 'text-[#6b6b69]'
                        }`}
                      >
                        {step.title}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0052cc] text-white font-medium">
                          ANALYSE
                        </span>
                      )}
                      {isCompleted && <span className="text-[10px] font-mono text-[#059669] font-semibold">VALIDÉ</span>}
                    </div>
                    {isCurrent && <p className="text-[11px] text-[#6b6b69] mt-1 leading-snug">{step.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#e2e0db] text-center">
            <p className="text-[11px] text-[#6b6b69]">
              ⚡ Propulsé par l'API Google PageSpeed V5 & l'Ingénierie Arweb.ca
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
