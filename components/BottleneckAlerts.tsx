'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { AuditIssue } from '@/types/audit';

interface BottleneckAlertsProps {
  issues: AuditIssue[];
  onUnlockDeepAudit: () => void;
}

export const BottleneckAlerts: React.FC<BottleneckAlertsProps> = ({
  issues,
  onUnlockDeepAudit,
}) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#137333]/30 shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-[#e6f4ea] flex items-center justify-center text-[#137333] flex-shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-[#202124]">Aucune anomalie critique détectée</h3>
          <p className="text-sm text-[#5f6368] mt-0.5">
            Votre site respecte les standards techniques essentiels pour le SEO, la sécurité et la structure mobile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#b3261e] uppercase tracking-wider mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Points de friction détectés ({issues.length})</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#202124]">
            Anomalies techniques & freins au référencement
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
        {issues.map((item, idx) => {
          const isCritical = item.severity === 'critical';
          const isHigh = item.severity === 'high';
          const isMedium = item.severity === 'medium';

          const badgeClass = isCritical
            ? 'bg-[#fce8e6] text-[#b3261e] border-[#b3261e]/30'
            : isHigh
            ? 'bg-[#fef7e0] text-[#b06000] border-[#b06000]/30'
            : isMedium
            ? 'bg-[#e8f0fe] text-[#0b57d0] border-[#0b57d0]/30'
            : 'bg-[#f8f9fa] text-[#5f6368] border-[#dadce0]';

          const severityLabel = isCritical
            ? 'CRITIQUE'
            : isHigh
            ? 'ÉLEVÉE'
            : isMedium
            ? 'MODÉRÉE'
            : 'OPTIMISATION';

          const difficultyLabel = item.difficulty === 'easy'
            ? 'Action rapide'
            : item.difficulty === 'moderate'
            ? 'Effort modéré'
            : 'Intervention avancée';

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className={`p-6 rounded-[22px] border transition-all flex flex-col justify-between bg-white shadow-sm ${
                isCritical
                  ? 'border-[#b3261e]/40'
                  : isHigh
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
                    ) : isHigh ? (
                      <AlertTriangle className="w-5 h-5 text-[#b06000] flex-shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-[#0b57d0] flex-shrink-0" />
                    )}
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                      {severityLabel}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#f8f9fa] border border-[#dadce0] text-[#5f6368]">
                    {difficultyLabel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-[#202124] mb-2 leading-snug tracking-tight">
                  {item.title}
                </h3>

                {/* Evidence Callout */}
                <div className="mb-3 p-2.5 rounded-xl bg-[#f8f9fa] border border-[#dadce0] text-xs font-mono text-[#202124] break-words">
                  <span className="text-[#5f6368] font-sans font-semibold mr-1.5">Détection :</span>
                  {item.evidence}
                </div>

                {/* Impact Text */}
                <p className="text-sm text-[#5f6368] leading-relaxed mb-4">
                  {item.impactExplanation}
                </p>
              </div>

              {/* Recommendation Callout */}
              <div className="pt-3 border-t border-[#dadce0] mt-2 bg-[#f0f6ff] p-3.5 rounded-xl border border-[#0b57d0]/15">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0b57d0] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#202124] font-medium leading-relaxed">
                    <strong className="text-[#0b57d0]">Recommandation :</strong> {item.recommendation}
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
