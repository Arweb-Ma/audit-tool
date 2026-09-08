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
import { AlertCircle, Lock, Sparkles, MessageSquare } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f9f8f6] text-[#1a1a18] flex flex-col font-sans selection:bg-[#0052cc] selection:text-white">
      {/* Header matching arweb.ca */}
      <Header />

      {/* Main Hero & Input */}
      <main className="flex-1">
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Error Notification */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto px-4 mb-8">
            <div className="p-4 rounded-xl bg-[#fef2f2] border border-[#dc2626]/30 text-[#dc2626] flex items-center space-x-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0" />
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

                {/* Gated Lead Capture Banner matching arweb.ca */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-light p-8 sm:p-10 rounded-2xl border border-[#0052cc]/30 bg-white text-center space-y-4 shadow-card"
                >
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#e8f0ff] text-[#0052cc] border border-[#0052cc]/20 text-xs font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Audit Technique Détaillé & Recommandations Code</span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#111110] tracking-tight">
                    Obtenez Les Corrections De Code Pour <span className="text-[#0052cc] font-mono">{auditResult.domain}</span>
                  </h3>

                  <p className="text-sm sm:text-base text-[#6b6b69] max-w-2xl mx-auto leading-relaxed">
                    Débloquez notre proposition de croissance de 12 pages, les optimisations techniques approfondies et demandez un entretien individuel gratuit avec un architecte web Arweb.ca.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => setIsLeadModalOpen(true)}
                      className="btn-blue py-4 px-8 text-sm sm:text-base shadow-md w-full sm:w-auto justify-center"
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                      <span>Débloquer Le Rapport Complet (Gratuit)</span>
                    </button>

                    <a
                      href={`https://wa.me/212600000000?text=Bonjour%20Arweb.ca!%20Je%20viens%20d'analyser%20${encodeURIComponent(
                        auditResult.domain
                      )}%20(Score:%20${auditResult.overallScore}/100).%20Je%20souhaite%20réserver%20un%20échange!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline py-4 px-6 text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      <MessageSquare className="w-5 h-5 text-[#059669]" />
                      <span>Échanger Sur WhatsApp</span>
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
