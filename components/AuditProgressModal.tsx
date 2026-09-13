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
    description: 'Vérification de la structure HTML, des balises OpenGraph, du viewport mobile & du temps de réponse serveur...',
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
    title: 'Vérification SEO Multilingue & Indexation IA',
    description: 'Évaluation des schémas structurés JSON-LD, balises hreflang FR/EN/AR & visibilité pour ChatGPT Search...',
    icon: Languages,
  },
  {
    id: 4,
    title: 'Génération du Diagnostic & Score Composite',
    description: 'Calcul pondéré des 7 dimensions techniques et priorisation des recommandations factuelles...',
    icon: Sparkles,
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
    }, 220);

    const step1Timer = setTimeout(() => setCurrentStepIndex(1), 2500);
    const step2Timer = setTimeout(() => setCurrentStepIndex(2), 6500);
    const step3Timer = setTimeout(() => setCurrentStepIndex(3), 14000);

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202124]/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl bg-white rounded-[28px] p-6 sm:p-8 border border-[#dadce0] shadow-[0_16px_44px_rgba(32,33,36,0.14)] relative text-[#202124]"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#0b57d0]">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight text-[#202124]">
                Diagnostic Arweb en cours
              </h3>
              <p className="text-xs text-[#5f6368] font-mono truncate max-w-[320px] sm:max-w-md">
                Analyse de : <span className="text-[#0b57d0] font-semibold">{targetUrl}</span>
              </p>
            </div>
          </div>

          {/* Progress Box */}
          <div className="relative my-6 py-6 flex flex-col items-center justify-center bg-[#f0f6ff] rounded-2xl border border-[#dadce0]/60 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-[#0b57d0] shadow-sm flex items-center justify-center mb-2">
                {React.createElement(currentStep.icon, { className: 'w-7 h-7 text-[#0b57d0] animate-pulse' })}
              </div>
              <p className="text-3xl font-medium tracking-tight text-[#202124]">{progressPct}%</p>
              <p className="text-xs text-[#5f6368] uppercase tracking-widest mt-0.5 font-bold">Analyse en temps réel</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#dadce0] rounded-full h-2 mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-[#0b57d0] rounded-full"
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
                  className={`flex items-start space-x-3 p-3 rounded-2xl border transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#e8f0fe] border-[#0b57d0]/40'
                      : isCompleted
                      ? 'bg-white border-[#dadce0]'
                      : 'bg-[#f8f9fa] border-[#dadce0] opacity-60'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#137333]" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#0b57d0] animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#dadce0] flex items-center justify-center text-[10px] text-[#5f6368] font-mono">
                        {step.id}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs sm:text-sm font-semibold ${
                          isCurrent ? 'text-[#0b57d0]' : isCompleted ? 'text-[#202124]' : 'text-[#5f6368]'
                        }`}
                      >
                        {step.title}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0b57d0] text-white font-semibold">
                          EN COURS
                        </span>
                      )}
                      {isCompleted && <span className="text-[10px] font-mono text-[#137333] font-bold">VALIDÉ</span>}
                    </div>
                    {isCurrent && <p className="text-[11px] text-[#5f6368] mt-1 leading-snug">{step.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#dadce0] text-center">
            <p className="text-xs text-[#5f6368]">
              Arweb · Création web, SEO & Analytics au Maroc et région MENA
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
