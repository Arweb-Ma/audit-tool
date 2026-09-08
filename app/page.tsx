'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { AuditProgressModal } from '@/components/AuditProgressModal';
import { ScoreGauge } from '@/components/ScoreGauge';
import { BottleneckAlerts } from '@/components/BottleneckAlerts';
import { MetricsGrid } from '@/components/MetricsGrid';
import { GeoAiReadiness } from '@/components/GeoAiReadiness';
import { LeadCaptureModal } from '@/components/LeadCaptureModal';
import { LeadSuccessState } from '@/components/LeadSuccessState';
import { AgencyCTA } from '@/components/AgencyCTA';
import { AuditResult } from '@/app/api/analyze/route';
import { AlertCircle, Lock, Sparkles, MessageSquare, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (url: string) => {
    setTargetUrl(url);
    setIsLoading(true);
    setErrorMsg('');
    setAuditResult(null);
    setIsUnlocked(false);

    try {
      const [res] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        }),
        new Promise((resolve) => setTimeout(resolve, 4500)),
      ]);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Impossible d\'analyser le site web.');
      }

      setAuditResult(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur s\'est produite lors de l\'analyse.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSuccess = ({ whatsappLink }: { whatsappLink: string }) => {
    setIsLeadModalOpen(false);
    setIsUnlocked(true);
    setWhatsappLink(whatsappLink);
  };

  return (
    <div className="min-h-screen bg-white text-[#202124] flex flex-col font-sans selection:bg-[#0b57d0] selection:text-white">
      {/* Header */}
      <Header />

      {/* Main Hero & Input */}
      <main className="flex-1">
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Error Notification */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto px-4 mb-8">
            <div className="p-4 rounded-2xl bg-[#fce8e6] border border-[#b3261e]/30 text-[#b3261e] flex items-center space-x-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-[#b3261e] flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Results Dashboard Section */}
        {auditResult && (
          <section ref={resultsRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            {/* Top Score Gauge */}
            <ScoreGauge
              score={auditResult.overallScore}
              grade={auditResult.grade}
              domain={auditResult.domain}
            />

            {/* Unlocked State / Lead Success View */}
            {isUnlocked ? (
              <LeadSuccessState auditResult={auditResult} whatsappLink={whatsappLink} />
            ) : (
              <>
                {/* 3-4 High-Impact Business Bottlenecks */}
                <BottleneckAlerts
                  bottlenecks={auditResult.businessBottlenecks}
                  onUnlockDeepAudit={() => setIsLeadModalOpen(true)}
                />

                {/* Core Web Vitals Grid */}
                <MetricsGrid metrics={auditResult.metrics} />

                {/* Multilingual SEO & GEO AI Readiness */}
                <GeoAiReadiness seoAndGeo={auditResult.seoAndGeo} />

                {/* Gated Lead Capture Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 sm:p-12 rounded-[28px] border border-[#dadce0] bg-[#f0f6ff] text-center space-y-4 shadow-sm"
                >
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white text-[#0b57d0] border border-[#dadce0] text-xs font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Plan d'action & recommandations personnalisées</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-medium tracking-tight text-[#202124]">
                    Besoin d'un accompagnement technique pour <span className="text-[#0b57d0] font-semibold">{auditResult.domain}</span> ?
                  </h3>

                  <p className="text-base sm:text-lg text-[#5f6368] max-w-2xl mx-auto leading-relaxed">
                    Débloquez votre synthèse technique complète et échangez sans engagement avec un expert de l'équipe Arweb.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => setIsLeadModalOpen(true)}
                      className="button min-h-[52px] px-8 text-base shadow-sm w-full sm:w-auto justify-center"
                    >
                      <Sparkles className="w-5 h-5 text-white mr-2" />
                      <span>Débloquer mon plan d'action (Gratuit)</span>
                    </button>

                    <a
                      href={`mailto:contact@arweb.ma?subject=Diagnostic%20de%20performance%20pour%20${encodeURIComponent(auditResult.domain)}`}
                      className="button button-outline min-h-[52px] px-7 text-base w-full sm:w-auto justify-center"
                    >
                      <Mail className="w-5 h-5 text-[#0b57d0] mr-2" />
                      <span>Écrire à contact@arweb.ma</span>
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </section>
        )}
      </main>

      {/* Agency Footer CTA */}
      <AgencyCTA />

      {/* Animated Audit Progress Modal */}
      <AuditProgressModal isOpen={isLoading} targetUrl={targetUrl} />

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        auditResult={auditResult}
        onSuccess={handleLeadSuccess}
      />
    </div>
  );
}
