'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Layers, Zap, Server, Smartphone, Gauge } from 'lucide-react';
import { AuditResult } from '../app/api/analyze/route';

interface MetricsGridProps {
  metrics: AuditResult['metrics'];
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
      desc: 'Stabilité visuelle pour éviter les clics involontaires.',
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
      desc: 'Temps de réponse initial du serveur d\'hébergement.',
    },
    {
      title: 'Speed Index',
      value: metrics.speedIndex.value,
      status: metrics.speedIndex.status,
      icon: Gauge,
      target: 'Cible ≤ 3.4s',
      desc: 'Vitesse de remplissage visuel global de la page.',
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
    return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fce8e6] text-[#b3261e]">LENT</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-medium text-[#202124] tracking-tight flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[#0b57d0]" />
          <span>Métriques Core Web Vitals & Vitesse</span>
        </h2>
        <span className="text-xs text-[#5f6368] font-mono">Standards Google 2026</span>
      </div>

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

              <p className="text-xs font-semibold text-[#5f6368]">{card.title}</p>
              <div className="flex items-baseline space-x-2 my-1">
                <span className="text-2xl font-medium tracking-tight text-[#202124]">{card.value}</span>
                <span className="text-[11px] text-[#5f6368] font-mono">({card.target})</span>
              </div>
              <p className="text-xs text-[#5f6368] leading-snug">{card.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
