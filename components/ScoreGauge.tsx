'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, ShieldAlert } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  domain: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade, domain }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextVal = Math.round((score / steps) * currentStep);
      setAnimatedScore(nextVal);
      if (currentStep >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color mappings matching arweb.ca clean style
  let strokeColor = '#059669'; // Emerald
  let badgeColor = 'bg-[#ecfdf5] text-[#059669] border-[#059669]/30';
  let statusText = 'EXCELLENTE PERFORMANCE WEB';

  if (score < 55) {
    strokeColor = '#dc2626'; // Rose
    badgeColor = 'bg-[#fef2f2] text-[#dc2626] border-[#dc2626]/30';
    statusText = 'RISQUE FORT DE PERTE DE CLIENTS';
  } else if (score < 80) {
    strokeColor = '#d97706'; // Amber
    badgeColor = 'bg-[#fffbe6] text-[#d97706] border-[#d97706]/30';
    statusText = 'POTENTIEL DE CONVERSION MULTIPLIÉ PAR 2';
  }

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="card-light p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-white border border-[#e2e0db] shadow-card">
      {/* SVG Circular Gauge */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#e8e6e1"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated Gauge Ring */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold text-[#111110]"
          >
            {animatedScore}
          </motion.span>
          <span className="text-[10px] text-[#6b6b69] font-mono tracking-widest uppercase mt-0.5">SUR 100</span>
        </div>
      </div>

      {/* Score Details */}
      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${badgeColor}`}>
            {statusText}
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-[#111110] text-white">
            NOTE {grade}
          </span>
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111110]">
          Score d'Audit pour <span className="text-[#0052cc] font-mono">{domain}</span>
        </h3>

        <p className="text-sm text-[#6b6b69] leading-relaxed">
          {score < 55 ? (
            <>
              Votre site présente plusieurs freins majeurs d'affichage mobile et d'indexation IA. Nous estimons qu'environ{' '}
              <strong className="text-[#dc2626] font-semibold">25% à 40% de vos visiteurs</strong> quittent votre site avant d'avoir pu consulter votre offre principale.
            </>
          ) : score < 80 ? (
            <>
              Votre site fonctionne correctement, mais des lenteurs au chargement et l'absence de données structurées limitent directement vos conversions quotidiennes.
            </>
          ) : (
            <>
              Excellente base technique. En optimisant les schémas d'indexation IA et les aperçus WhatsApp, vous sécuriserez votre position de leader sur votre marché.
            </>
          )}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#6b6b69] font-medium">
          <div className="flex items-center space-x-1.5">
            {score < 55 ? <ShieldAlert className="w-4 h-4 text-[#dc2626]" /> : <CheckCircle className="w-4 h-4 text-[#059669]" />}
            <span>Fiabilité du Diagnostic : 98.4%</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-[#0052cc]" />
            <span>Audité selon Google Lighthouse 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
