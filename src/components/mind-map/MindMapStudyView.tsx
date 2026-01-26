import { useState } from 'react';
import { ArrowLeft, BookOpen, Building2, Church, Copy, Check, Sparkles, Lightbulb, Heart, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GeneratedStudy } from './types';

interface MindMapStudyViewProps {
  study: GeneratedStudy;
  sourceText: string;
  onBackToMap: () => void;
}

export default function MindMapStudyView({ study, sourceText, onBackToMap }: MindMapStudyViewProps) {
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const handleCopyStudy = async () => {
    const studyText = `
# ${study.title}

## Introduction
${study.introduction}

${study.sections.map((section, i) => `
## ${i + 1}. ${section.title}
${section.content}
${section.scriptures?.length ? `\nScriptures: ${section.scriptures.join(', ')}` : ''}
${section.palaceConnections?.length ? `\nPalace Connections: ${section.palaceConnections.join(', ')}` : ''}
`).join('\n')}

## Application Points
${study.applicationPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

${study.closingPrayer ? `## Closing Prayer\n${study.closingPrayer}` : ''}

${study.relatedPassages?.length ? `\n---\nRelated Passages: ${study.relatedPassages.join(', ')}` : ''}
`.trim();

    await navigator.clipboard.writeText(studyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background to-amber-500/5 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 border border-white/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Map</span>
          </button>

          <button
            onClick={handleCopyStudy}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 border border-white/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm">{copied ? 'Copied!' : 'Copy Study'}</span>
          </button>
        </div>

        {/* Study Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Title Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Jeeves Generated Study</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{study.title}</h1>
              <p className="text-muted-foreground italic text-sm">
                Based on: "{sourceText.length > 100 ? sourceText.substring(0, 100) + '...' : sourceText}"
              </p>
            </div>
          </div>

          {/* Introduction */}
          <div className="rounded-xl bg-card/80 border border-white/10 p-5">
            <div className="flex items-center gap-2 text-primary mb-3">
              <BookOpen className="w-5 h-5" />
              <h2 className="font-semibold">Introduction</h2>
            </div>
            <p className="text-foreground/90 leading-relaxed">{study.introduction}</p>
          </div>

          {/* Study Sections */}
          <div className="space-y-4">
            {study.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-card/80 border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <span className="flex-1 text-left font-semibold text-foreground">{section.title}</span>
                  <div className="text-muted-foreground text-sm">
                    {expandedSection === index ? '−' : '+'}
                  </div>
                </button>

                {expandedSection === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="pl-11 space-y-4">
                      <p className="text-foreground/90 leading-relaxed">{section.content}</p>

                      {/* Palace Connections */}
                      {section.palaceConnections && section.palaceConnections.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {section.palaceConnections.map((conn, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary"
                            >
                              <Building2 className="w-3 h-3" />
                              {conn}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Scriptures */}
                      {section.scriptures && section.scriptures.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {section.scriptures.map((ref, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400"
                            >
                              <BookMarked className="w-3 h-3" />
                              {ref}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Application Points */}
          <div className="rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-5">
            <div className="flex items-center gap-2 text-green-400 mb-4">
              <Lightbulb className="w-5 h-5" />
              <h2 className="font-semibold">Application Points</h2>
            </div>
            <ul className="space-y-3">
              {study.applicationPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-foreground/90">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing Prayer */}
          {study.closingPrayer && (
            <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 p-5">
              <div className="flex items-center gap-2 text-purple-400 mb-3">
                <Heart className="w-5 h-5" />
                <h2 className="font-semibold">Closing Prayer</h2>
              </div>
              <p className="text-foreground/90 italic leading-relaxed">{study.closingPrayer}</p>
            </div>
          )}

          {/* Related Passages */}
          {study.relatedPassages && study.relatedPassages.length > 0 && (
            <div className="rounded-xl bg-card/50 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Church className="w-4 h-4" />
                <span className="text-sm font-medium">Related Passages for Further Study</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {study.relatedPassages.map((ref, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
