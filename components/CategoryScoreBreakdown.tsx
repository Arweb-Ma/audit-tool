'use client';

import React from 'react';
import { CategoryScores } from '@/types/audit';
import { Search, Zap, Compass, Code, Smartphone, ShieldCheck, Share2 } from 'lucide-react';

interface CategoryScoreBreakdownProps {
  categories: CategoryScores;
}

const CATEGORY_CONFIG: Record<
  keyof CategoryScores,
  { icon: React.ComponentType<{ className?: string }>; color: string; desc: string }
> = {
  seo: {
    icon: Search,
    color: '#0b57d0',
    desc: 'Balises title, meta description, structure H1/H2 et balisage sémantique de base.',
  },
  performance: {
    icon: Zap,
    color: '#0b57d0',
    desc: 'Indicateurs de vitesse et de stabilité visuelle (Core Web Vitals et TTFB).',
  },
  indexability: {
    icon: Compass,
    color: '#137333',
    desc: 'Directives d\'exploration (robots, canonical, sitemap.xml et robots.txt).',
  },
  schema: {
    icon: Code,
    color: '#7b1fa2',
    desc: 'Données structurées JSON-LD pour l\'interprétation par les moteurs et l\'IA.',
  },
  mobile: {
    icon: Smartphone,
    color: '#b06000',
    desc: 'Configuration viewport, accessibilité des images et hygiène des liens.',
  },
  security: {
    icon: ShieldCheck,
    color: '#137333',
    desc: 'Protocole HTTPS, chiffrement HSTS et en-têtes HTTP de protection.',
  },
  social: {
    icon: Share2,
    color: '#0b57d0',
    desc: 'Balises OpenGraph et Twitter Cards pour un partage optimal sur les réseaux.',
  },
};

export const CategoryScoreBreakdown: React.FC<CategoryScoreBreakdownProps> = ({ categories }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#202124]">
          Détail des 7 catégories auditées
        </h3>
        <span className="text-xs text-[#5f6368] font-normal">
          Pondération indépendante ARWEB · Note de 0 à 100
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(categories) as Array<keyof CategoryScores>).map((key) => {
          const cat = categories[key];
          const cfg = CATEGORY_CONFIG[key];
          const Icon = cfg.icon;

          let scoreColor = '#137333';
          let bgColor = 'bg-[#e6f4ea] text-[#137333]';

          if (cat.score < 55) {
            scoreColor = '#b3261e';
            bgColor = 'bg-[#fce8e6] text-[#b3261e]';
          } else if (cat.score < 80) {
            scoreColor = '#b06000';
            bgColor = 'bg-[#fef7e0] text-[#b06000]';
          }

          return (
            <div
              key={key}
              className="p-5 rounded-2xl bg-white border border-[#dadce0] hover:border-[#0b57d0] transition-all shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f6ff] flex items-center justify-center text-[#0b57d0]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-[#202124]">{cat.label}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bgColor}`}>
                    {cat.score}/100
                  </span>
                </div>

                <p className="text-xs text-[#5f6368] leading-relaxed mb-3">{cfg.desc}</p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="w-full bg-[#f1f3f4] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.score}%`, backgroundColor: scoreColor }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#5f6368] mt-1.5 font-medium">
                  <span>Pondération : {cat.weight}%</span>
                  <span>{cat.score >= 80 ? 'Fort' : cat.score >= 55 ? 'À améliorer' : 'Prioritaire'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
