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
  'Finance & Assurance',
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#111110]/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e0db] shadow-modal relative text-[#1a1a18] my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#f0ede8] hover:bg-[#e8e6e1] text-[#6b6b69] hover:text-[#111110] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#e8f0ff] text-[#0052cc] border border-[#0052cc]/30 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5 text-[#0052cc]" />
            <span>Plan d'Action Technique Complet</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111110] tracking-tight leading-tight">
            Recevez Votre <span className="underline-accent text-[#0052cc]">Rapport Arweb.ca</span>
          </h3>

          <p className="text-xs sm:text-sm text-[#6b6b69] mt-2 mb-6">
            Obtenez un rapport détaillé de 12 pages avec les corrections de code recommandées pour <strong className="text-[#0052cc]">{auditResult.domain}</strong> et un entretien avec notre architecte web.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom Complet */}
            <div>
              <label className="block text-xs font-semibold text-[#1a1a18] mb-1.5">Nom & Prénom *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6b6b69] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Julien Tremblay"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#f9f8f6] border border-[#e2e0db] text-[#1a1a18] placeholder-[#b0ada6] text-sm focus:outline-none focus:border-[#0052cc] focus:bg-white"
                />
              </div>
            </div>

            {/* Courriel */}
            <div>
              <label className="block text-xs font-semibold text-[#1a1a18] mb-1.5">Adresse Courriel Professionnelle *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6b6b69] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.ca"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#f9f8f6] border border-[#e2e0db] text-[#1a1a18] placeholder-[#b0ada6] text-sm focus:outline-none focus:border-[#0052cc] focus:bg-white"
                />
              </div>
            </div>

            {/* Numéro WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-[#1a1a18] mb-1.5">
                Numéro WhatsApp (pour l'envoi instantané du rapport) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#059669] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 514 000-0000 ou +212 6..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#f9f8f6] border border-[#e2e0db] text-[#1a1a18] placeholder-[#b0ada6] text-sm focus:outline-none focus:border-[#059669] focus:bg-white font-mono"
                />
              </div>
            </div>

            {/* Secteur d'activité */}
            <div>
              <label className="block text-xs font-semibold text-[#1a1a18] mb-1.5">Secteur d'Activité</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#6b6b69] absolute left-3.5 top-3.5" />
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#f9f8f6] border border-[#e2e0db] text-[#1a1a18] text-sm focus:outline-none focus:border-[#0052cc]"
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-[#dc2626] font-medium pt-1">{errorMsg}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg bg-[#111110] hover:bg-[#2a2a28] text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Déverrouillage en cours...</span>
                </>
              ) : (
                <>
                  <span>Débloquer l'Audit Technique Gratuit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-4 pt-3 border-t border-[#e2e0db] flex items-center justify-between text-[11px] text-[#6b6b69]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>100% Confidentiel • Zéro Spam</span>
            </span>
            <span className="font-mono text-[#0052cc]">Arweb.ca Certifié</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
