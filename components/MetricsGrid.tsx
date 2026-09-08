'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Layers, Zap, Server, Smartphone, Gauge, Info } from 'lucide-react';
import { CoreWebVitals } from '@/types/audit';

interface MetricsGridProps {
  metrics: CoreWebVitals;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Largest Contentful Paint (LCP)',
      value: metrics.lcp.value,
      status: metrics.lcp.status,
      icon: Clock,
      target: 'Cible ≤ 2.5s',
      desc: 'Affichage du contenu principal (titre / image héroïque).',
    },
    {
      title: 'Cumulative Layout Shift (CLS)',
      value: metrics.cls.value,
      status: metrics.cls.status,
      icon: Layers,
      target: 'Cible ≤ 0.1',
      desc: 'Stabilité visuelle pour éviter les décalages de mise en page.',
    },
    {
      title: 'First Contentful Paint (FCP)',
      value: metrics.fcp.value,
      status: metrics.fcp.status,
      icon: Zap,
      target: 'Cible ≤ 1.8s',
      desc: 'Apparition du premier élément visible à l\'écran.',
    },
    {
      title: 'Time to First Byte (TTFB)',
      value: metrics.ttfb.value,
      status: metrics.ttfb.status,
      icon: Server,
      target: 'Cible ≤ 800ms',
      desc: metrics.directTtfbMs 
        ? `Mesuré directement : ${metrics.directTtfbMs}ms.` 
        : 'Temps de réponse initial du serveur web.',
    },
    {
      title: 'Speed Index',
      value: metrics.speedIndex.value,
      status: metrics.speedIndex.status,
      icon: Gauge,
      target: 'Cible ≤ 3.4s',
      desc: 'Vitesse de remplissage visuel global de la fenêtre.',
    },
    {
      title: 'Viewport Mobile Responsive',
      value: metrics.mobileFriendly ? 'Optimisé' : 'Balise manquante',
      status: metrics.mobileFriendly ? 'good' : 'poor',
      icon: Smartphone,
      target: 'Requis mobile',
      desc: 'Indispensable pour l\'indexation Google Mobile-First.',
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'good') {
      return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">OPTIMAL</span>;
    }
    if (status === 'needs-improvement') {
      return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000]">MOYEN</span>;
    }
    if (status === 'poor') {
      return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fce8e6] text-[#b3261e]">LENT</span>;
    }
    return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f8f9fa] text-[#5f6368]">NON DISPONIBLE</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-medium text-[#202124] tracking-tight flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[#0b57d0]" />
          <span>Métriques Vitesse & Core Web Vitals</span>
        </h2>
        <div className="flex items-center space-x-2 text-xs text-[#5f6368] font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-[#f8f9fa] border border-[#dadce0]">
            {metrics.source === 'lighthouse-lab' ? 'Données Lab (PageSpeed V5)' : 'Audit Direct'}
          </span>
        </div>
      </div>

      {!metrics.available && (
        <div className="p-4 rounded-2xl bg-[#f0f6ff] border border-[#0b57d0]/20 text-xs text-[#5f6368] flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-[#0b57d0] mt-0.5 flex-shrink-0" />
          <p>
            {metrics.note || 'L\'API PageSpeed Insights est temporairement indisponible ou protégée. Les métriques de temps de réponse serveur (TTFB) et de structure mobile ont été mesurées directement par notre analyseur.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="p-5 rounded-2xl bg-white border border-[#dadce0] hover:border-[#0b57d0] transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#0b57d0]">
                  <Icon className="w-5 h-5" />
                </div>
                {getStatusBadge(card.status)}
              </div>

              <div className="space-y-1">
                <span className="text-xs text-[#5f6368] font-medium block truncate">{card.title}</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202124] font-mono">
                    {card.value}
                  </span>
                  <span className="text-[11px] text-[#5f6368] font-mono">{card.target}</span>
                </div>
                <p className="text-xs text-[#5f6368] pt-1 leading-snug">{card.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
