'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, TrendingDown, Lock, CheckCircle2 } from 'lucide-react';
import { AuditResult } from '../app/api/analyze/route';

interface BottleneckAlertsProps {
  bottlenecks: AuditResult['businessBottlenecks'];
  onUnlockDeepAudit: () => void;
}

export const BottleneckAlerts: React.FC<BottleneckAlertsProps> = ({
  bottlenecks,
  onUnlockDeepAudit,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#dc2626] uppercase tracking-widest mb-1">
            <TrendingDown className="w-4 h-4" />
            <span>Manque À Gagner Détecté</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111110]">
            Freins Principaux De Conversion
          </h2>
        </div>
        <button
          onClick={onUnlockDeepAudit}
          className="btn-outline text-xs sm:text-sm font-semibold flex items-center space-x-2"
        >
          <Lock className="w-4 h-4 text-[#0052cc]" />
          <span>Débloquer Le Plan d'Action Complet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bottlenecks.map((item, idx) => {
          const isCritical = item.severity === 'critical';
          const isWarning = item.severity === 'warning';

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className={`card-light card-light-hover p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isCritical
                  ? 'border-[#dc2626]/30 bg-white'
                  : isWarning
                  ? 'border-[#d97706]/30 bg-white'
                  : 'border-[#e2e0db] bg-white'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    {isCritical ? (
                      <AlertCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5 text-[#d97706] flex-shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-[#0052cc] flex-shrink-0" />
                    )}
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-[#fef2f2] text-[#dc2626] border-[#dc2626]/30'
                          : isWarning
                          ? 'bg-[#fffbe6] text-[#d97706] border-[#d97706]/30'
                          : 'bg-[#e8f0ff] text-[#0052cc] border-[#0052cc]/30'
                      }`}
                    >
                      {isCritical ? 'CRITIQUE' : isWarning ? 'ATTENTION' : 'OPTIMISATION'}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#111110] text-white">
                    {item.estimatedRevenueLoss}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-[#111110] mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Impact Text */}
                <p className="text-xs sm:text-sm text-[#6b6b69] leading-relaxed mb-4">
                  {item.impactText}
                </p>
              </div>

              {/* Recommendation Box matching arweb.ca accent-light */}
              <div className="pt-4 border-t border-[#e2e0db] mt-2 bg-[#e8f0ff]/60 p-3.5 rounded-xl border border-[#0052cc]/10">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0052cc] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#1a1a18] font-medium leading-snug">
                    <span className="text-[#0052cc] font-bold">Solution Arweb.ca :</span>{' '}
                    {item.recommendation}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
