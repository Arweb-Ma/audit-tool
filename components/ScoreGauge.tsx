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

  // Color mappings matching Google/Arweb design system
  let strokeColor = '#137333'; // Google Green
  let badgeColor = 'bg-[#e6f4ea] text-[#137333] border-[#137333]/30';
  let statusText = 'EXCELLENTE SANTÉ DIGITALE';

  if (score < 55) {
    strokeColor = '#b3261e'; // Google Red
    badgeColor = 'bg-[#fce8e6] text-[#b3261e] border-[#b3261e]/30';
    statusText = 'FREINS MAJEURS DE CONVERSION';
  } else if (score < 80) {
    strokeColor = '#b06000'; // Google Amber
    badgeColor = 'bg-[#fef7e0] text-[#b06000] border-[#b06000]/30';
    statusText = 'OPPORTUNITÉS DE CROISSANCE DISPONIBLES';
  }

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#dadce0] shadow-[0_8px_30px_rgba(32,33,36,0.06)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
      {/* SVG Circular Gauge */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#dadce0"
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
            className="text-4xl sm:text-5xl font-medium tracking-tight text-[#202124]"
          >
            {animatedScore}
          </motion.span>
          <span className="text-[11px] text-[#5f6368] font-bold tracking-widest uppercase mt-0.5">SUR 100</span>
        </div>
      </div>

      {/* Score Details */}
      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className={`text-xs px-3.5 py-1 rounded-full font-bold border ${badgeColor}`}>
            {statusText}
          </span>
          <span className="text-xs px-3.5 py-1 rounded-full font-bold bg-[#0b57d0] text-white">
            NIVEAU {grade}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#202124]">
          Résultats d'audit pour <span className="text-[#0b57d0] font-semibold">{domain}</span>
        </h3>

        <p className="text-sm sm:text-base text-[#5f6368] leading-relaxed max-w-2xl">
          {score < 55 ? (
            <>
              Votre site présente plusieurs freins techniques majeurs sur mobile et SEO. Une part significative de vos visiteurs risque de quitter la page avant de découvrir vos services.
            </>
          ) : score < 80 ? (
            <>
              Votre base technique est fonctionnelle, mais des gains notables de vitesse, d'indexation structurée et de suivi de conversion peuvent doubler vos résultats.
            </>
          ) : (
            <>
              Très bonne structure technique. Des ajustements ciblés sur les schémas de données et les cartes de partage consolideront votre avance sur votre marché.
            </>
          )}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#5f6368] font-medium">
          <div className="flex items-center space-x-1.5">
            {score < 55 ? <ShieldAlert className="w-4 h-4 text-[#b3261e]" /> : <CheckCircle className="w-4 h-4 text-[#137333]" />}
            <span>Conforme aux standards Google Core Web Vitals</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-[#0b57d0]" />
            <span>Méthodologie Arweb · Création web & SEO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
