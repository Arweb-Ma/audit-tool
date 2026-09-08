'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ArrowRight, ShieldCheck, User, Mail, Phone, Building2 } from 'lucide-react';
import { AuditResult } from '../app/api/analyze/route';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: AuditResult | null;
  onSuccess: (data: { whatsappLink: string }) => void;
}

const SECTORS = [
  'E-Commerce & Vente en Ligne',
  'Immobilier & Promoteurs',
  'SaaS & Logiciel Tech',
  'Santé, Cliniques & Médical',
  'Services Professionnels & Conseil',
  'Finance, Banque & Assurance',
  'Hôtellerie & Tourisme',
  'Autre Secteur d\'Activité',
];

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  auditResult,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sector, setSector] = useState(SECTORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !auditResult) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      setErrorMsg('Veuillez compléter votre nom, courriel et numéro WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          sector,
          websiteUrl: auditResult.url,
          score: auditResult.overallScore,
          bottlenecks: auditResult.businessBottlenecks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Échec de l\'envoi.');
      }

      onSuccess({ whatsappLink: data.whatsappLink });
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202124]/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-8 border border-[#dadce0] shadow-[0_16px_44px_rgba(32,33,36,0.16)] relative text-[#202124] my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#f8f9fa] hover:bg-[#dadce0] text-[#5f6368] hover:text-[#202124] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#e8f0fe] text-[#0b57d0] border border-[#0b57d0]/20 text-xs font-bold mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Plan d'action & recommandations</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-medium text-[#202124] tracking-tight leading-tight">
            Recevez votre diagnostic <span className="text-[#0b57d0]">Arweb</span>
          </h3>

          <p className="text-sm text-[#5f6368] mt-2 mb-6">
            Obtenez une analyse détaillée des freins de <strong className="text-[#0b57d0]">{auditResult.domain}</strong> et échangez directement avec notre équipe technique.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom Complet */}
            <div>
              <label className="block text-xs font-bold text-[#202124] mb-1.5 uppercase tracking-wider">Nom & Prénom *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#5f6368] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Karim Benali"
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-[#f8f9fa] border border-[#dadce0] text-[#202124] placeholder-[#5f6368] text-sm focus:outline-none focus:border-[#0b57d0] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Courriel */}
            <div>
              <label className="block text-xs font-bold text-[#202124] mb-1.5 uppercase tracking-wider">Courriel professionnel *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5f6368] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@entreprise.ma"
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-[#f8f9fa] border border-[#dadce0] text-[#202124] placeholder-[#5f6368] text-sm focus:outline-none focus:border-[#0b57d0] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Numéro WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-[#202124] mb-1.5 uppercase tracking-wider">
                Numéro WhatsApp (pour l'envoi du rapport) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#137333] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+212 6 00 00 00 00"
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-[#f8f9fa] border border-[#dadce0] text-[#202124] placeholder-[#5f6368] text-sm focus:outline-none focus:border-[#137333] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* Secteur d'activité */}
            <div>
              <label className="block text-xs font-bold text-[#202124] mb-1.5 uppercase tracking-wider">Secteur d'activité</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#5f6368] absolute left-3.5 top-3.5" />
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-[#f8f9fa] border border-[#dadce0] text-[#202124] text-sm focus:outline-none focus:border-[#0b57d0]"
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-[#b3261e] font-medium pt-1">{errorMsg}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full button min-h-[50px] font-bold text-base shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <span>Débloquer mon audit gratuit</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-5 pt-3 border-t border-[#dadce0] flex items-center justify-between text-xs text-[#5f6368]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#137333]" />
              <span>Confidentialité garantie · Sans engagement</span>
            </span>
            <span className="font-mono text-[#0b57d0]">contact@arweb.ma</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
