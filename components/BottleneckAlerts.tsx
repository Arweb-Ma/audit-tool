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
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#b3261e] uppercase tracking-wider mb-1">
            <TrendingDown className="w-4 h-4" />
            <span>Points de friction détectés</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#202124]">
            Freins majeurs à la conversion
          </h2>
        </div>
        <button
          onClick={onUnlockDeepAudit}
          className="button button-outline button-compact text-xs sm:text-sm font-bold flex items-center space-x-2"
        >
          <Lock className="w-4 h-4 text-[#0b57d0]" />
          <span>Débloquer le plan d'action</span>
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
              className={`p-6 rounded-[22px] border transition-all flex flex-col justify-between bg-white shadow-sm ${
                isCritical
                  ? 'border-[#b3261e]/40'
                  : isWarning
                  ? 'border-[#b06000]/40'
                  : 'border-[#dadce0]'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    {isCritical ? (
                      <AlertCircle className="w-5 h-5 text-[#b3261e] flex-shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5 text-[#b06000] flex-shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-[#0b57d0] flex-shrink-0" />
                    )}
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-[#fce8e6] text-[#b3261e] border-[#b3261e]/30'
                          : isWarning
                          ? 'bg-[#fef7e0] text-[#b06000] border-[#b06000]/30'
                          : 'bg-[#e8f0fe] text-[#0b57d0] border-[#0b57d0]/30'
                      }`}
                    >
                      {isCritical ? 'PRIORITAIRE' : isWarning ? 'IMPORTANT' : 'OPTIMISATION'}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#f8f9fa] border border-[#dadce0] text-[#202124]">
                    {item.estimatedRevenueLoss}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-[#202124] mb-2 leading-snug tracking-tight">
                  {item.title}
                </h3>

                {/* Impact Text */}
                <p className="text-sm text-[#5f6368] leading-relaxed mb-4">
                  {item.impactText}
                </p>
              </div>

              {/* Recommendation Callout */}
              <div className="pt-3 border-t border-[#dadce0] mt-2 bg-[#f0f6ff] p-3.5 rounded-xl border border-[#0b57d0]/15">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0b57d0] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#202124] font-medium leading-snug">
                    <span className="text-[#0b57d0] font-bold">Approche Arweb :</span>{' '}
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
