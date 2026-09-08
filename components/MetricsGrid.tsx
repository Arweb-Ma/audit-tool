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
      desc: 'Temps d\'affichage du visuel ou titre principal de la page.',
    },
    {
      title: 'Cumulative Layout Shift (CLS)',
      value: metrics.cls.value,
      status: metrics.cls.status,
      icon: Layers,
      target: 'Cible ≤ 0.1',
      desc: 'Stabilité visuelle empêchant les clics involontaires.',
    },
    {
      title: 'First Contentful Paint (FCP)',
      value: metrics.fcp.value,
      status: metrics.fcp.status,
      icon: Zap,
      target: 'Cible ≤ 1.8s',
      desc: 'Premier élément visuel textuel ou graphique affiché.',
    },
    {
      title: 'Time to First Byte (TTFB)',
      value: metrics.ttfb.value,
      status: metrics.ttfb.status,
      icon: Server,
      target: 'Cible ≤ 800ms',
      desc: 'Vitesse de réponse initiale du serveur web.',
    },
    {
      title: 'Speed Index',
      value: metrics.speedIndex.value,
      status: metrics.speedIndex.status,
      icon: Gauge,
      target: 'Cible ≤ 3.4s',
      desc: 'Vitesse globale de remplissage visuel de l\'écran.',
    },
    {
      title: 'Comportement Mobile Viewport',
      value: metrics.mobileFriendly ? 'Optimisé' : 'Balise Manquante',
      status: metrics.mobileFriendly ? 'good' : 'poor',
      icon: Smartphone,
      target: 'Requis Mobile',
      desc: 'Indispensable pour l\'indexation Google Mobile-First.',
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'good') {
      return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] border border-[#059669]/30">OPTIMAL</span>;
    }
    if (status === 'needs-improvement') {
      return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fffbe6] text-[#d97706] border border-[#d97706]/30">MOYEN</span>;
    }
    return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fef2f2] text-[#dc2626] border border-[#dc2626]/30">LENT</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#111110] tracking-tight flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[#0052cc]" />
          <span>Métriques Core Web Vitals & Vitesse</span>
        </h2>
        <span className="text-xs text-[#6b6b69] font-mono">Stratégie Mobile 2026</span>
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
              className="card-light card-light-hover p-5 rounded-2xl bg-white border border-[#e2e0db]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#e8f0ff] border border-[#0052cc]/20 flex items-center justify-center text-[#0052cc]">
                  <Icon className="w-5 h-5" />
                </div>
                {getStatusBadge(card.status)}
              </div>

              <p className="text-xs font-semibold text-[#6b6b69]">{card.title}</p>
              <div className="flex items-baseline space-x-2 my-1">
                <span className="font-heading text-2xl font-extrabold text-[#111110]">{card.value}</span>
                <span className="text-[11px] text-[#b0ada6] font-mono">({card.target})</span>
              </div>
              <p className="text-[11px] text-[#6b6b69] leading-snug">{card.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
