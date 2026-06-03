import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip
} from 'recharts';
import {
  CheckCircle, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp,
  RotateCcw, Target, Zap, BookOpen, Shield
} from 'lucide-react';
import { AnalysisResult, Suggestion } from '../types';
import ScoreRing from './ScoreRing';

interface ResultsStepProps {
  result: AnalysisResult;
  fileName: string;
  onReset: () => void;
}

const tabs = ['Overview', 'Keywords', 'Suggestions', 'Details'] as const;
type Tab = typeof tabs[number];

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const [expanded, setExpanded] = useState(false);

  const config = {
    error: { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', iconColor: 'text-red-500', badge: 'bg-red-100 text-red-700' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconColor: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
    success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', iconColor: 'text-green-500', badge: 'bg-green-100 text-green-700' },
    info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconColor: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
  };

  const { icon: Icon, bg, border, text, iconColor, badge } = config[suggestion.type];

  const priorityLabel = {
    high: '🔴 High',
    medium: '🟡 Medium',
    low: '🟢 Low',
  }[suggestion.priority];

  return (
    <motion.div
      layout
      className={`border rounded-xl overflow-hidden ${bg} ${border}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-medium text-sm ${text}`}>{suggestion.title}</p>
          </div>
          <div className="flex gap-2 mt-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
              {suggestion.category}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 text-slate-500 font-medium border border-white/50">
              {priorityLabel}
            </span>
          </div>
        </div>
        <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 pt-0 text-sm ${text} border-t ${border} bg-white/40`}>
              <p className="mt-3 leading-relaxed text-slate-600">{suggestion.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MiniBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600 font-medium">{label}</span>
        <span className="text-xs font-bold text-slate-700">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function ResultsStep({ result, fileName, onReset }: ResultsStepProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning' | 'success' | 'info'>('all');

  const radarData = [
    { subject: 'Formatting', value: result.score.sections.formatting },
    { subject: 'Keywords', value: result.score.sections.keywords },
    { subject: 'Experience', value: result.score.sections.experience },
    { subject: 'Skills', value: result.score.sections.skills },
    { subject: 'Education', value: result.score.sections.education },
    { subject: 'Impact', value: result.score.sections.impact },
  ];

  const sectionColors: Record<string, string> = {
    formatting: '#8b5cf6',
    keywords: '#6366f1',
    experience: '#3b82f6',
    skills: '#06b6d4',
    education: '#10b981',
    impact: '#f59e0b',
  };

  const filteredSuggestions = filterType === 'all'
    ? result.suggestions
    : result.suggestions.filter(s => s.type === filterType);

  const filterCounts = {
    all: result.suggestions.length,
    error: result.suggestions.filter(s => s.type === 'error').length,
    warning: result.suggestions.filter(s => s.type === 'warning').length,
    success: result.suggestions.filter(s => s.type === 'success').length,
    info: result.suggestions.filter(s => s.type === 'info').length,
  };

  const highKeywords = result.keywords.filter(k => k.importance === 'high');
  const medKeywords = result.keywords.filter(k => k.importance === 'medium');
  const lowKeywords = result.keywords.filter(k => k.importance === 'low');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{fileName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Analysis complete</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Analysis
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-150 relative ${
              activeTab === tab ? 'text-violet-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'Overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            {/* Score Ring + Radar */}
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <ScoreRing score={result.score.overall} size={160} label="Overall Score" />
              </div>
              <div className="flex-1 w-full" style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                      formatter={(v) => [`${v}/100`, 'Score']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section scores */}
            <div className="space-y-3 bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Section Breakdown</p>
              {Object.entries(result.score.sections).map(([key, val]) => (
                <MiniBar
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={val}
                  color={sectionColors[key] || '#8b5cf6'}
                />
              ))}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-xs font-semibold text-indigo-600">ATS Score</span>
                </div>
                <p className="text-2xl font-bold text-indigo-700">{result.atsCompatibility}<span className="text-sm font-normal">/100</span></p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs font-semibold text-green-600">Readability</span>
                </div>
                <p className="text-2xl font-bold text-green-700">{result.readabilityScore}<span className="text-sm font-normal">/100</span></p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-600">Word Count</span>
                </div>
                <p className="text-2xl font-bold text-amber-700">{result.wordCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Target className="w-3.5 h-3.5 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-600">Experience</span>
                </div>
                <p className="text-sm font-bold text-violet-700 leading-tight">{result.experienceLevel}</p>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Strengths
                </p>
                <ul className="space-y-1.5">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">●</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Areas to Improve
                </p>
                <ul className="space-y-1.5">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">●</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== KEYWORDS TAB ===== */}
        {activeTab === 'Keywords' && (
          <motion.div key="keywords" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            {/* Found / Missing stats */}
            <div className="flex gap-3">
              <div className="flex-1 p-3 rounded-xl bg-green-50 border border-green-100 text-center">
                <p className="text-2xl font-bold text-green-600">{result.keywords.filter(k => k.found).length}</p>
                <p className="text-xs text-green-600">Keywords Found</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-red-50 border border-red-100 text-center">
                <p className="text-2xl font-bold text-red-500">{result.keywords.filter(k => !k.found).length}</p>
                <p className="text-xs text-red-500">Keywords Missing</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-violet-50 border border-violet-100 text-center">
                <p className="text-2xl font-bold text-violet-600">{result.keywords.length}</p>
                <p className="text-xs text-violet-600">Total Scanned</p>
              </div>
            </div>

            {[
              { label: 'High Importance', keywords: highKeywords, badgeColor: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Medium Importance', keywords: medKeywords, badgeColor: 'bg-amber-50 border-amber-200 text-amber-700' },
              { label: 'Action Verbs', keywords: lowKeywords, badgeColor: 'bg-slate-50 border-slate-200 text-slate-600' },
            ].map(({ label, keywords, badgeColor }) => (
              <div key={label} className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map(k => (
                    <span
                      key={k.keyword}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        k.found
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : badgeColor + ' opacity-60'
                      }`}
                    >
                      <span>{k.found ? '✓' : '✗'}</span>
                      {k.keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-xs font-semibold text-indigo-700 mb-1.5">💡 Pro Tip</p>
              <p className="text-xs text-indigo-600 leading-relaxed">
                Mirror the exact language from the job description in your resume. Many ATS systems match keywords literally, so using "JavaScript" vs "JS" may affect your score.
              </p>
            </div>
          </motion.div>
        )}

        {/* ===== SUGGESTIONS TAB ===== */}
        {activeTab === 'Suggestions' && (
          <motion.div key="suggestions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            {/* Filter tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {(Object.entries(filterCounts) as [typeof filterType, number][]).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterType === type
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              <AnimatePresence>
                {filteredSuggestions.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <SuggestionCard suggestion={s} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredSuggestions.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No suggestions in this category.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== DETAILS TAB ===== */}
        {activeTab === 'Details' && (
          <motion.div key="details" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Detected Sections</p>
              <div className="flex flex-wrap gap-2">
                {result.detectedSections.map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-xs text-green-700 font-medium">
                    ✓ {s}
                  </span>
                ))}
              </div>
              {result.missingCriticalSections.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mt-3">Missing Critical Sections</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingCriticalSections.map(s => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2 bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Document Metadata</p>
              {[
                { label: 'File Name', value: fileName },
                { label: 'Word Count', value: `${result.wordCount} words` },
                { label: 'Est. Read Time', value: result.estimatedReadTime },
                { label: 'Detected Role', value: result.jobTitleMatch },
                { label: 'Experience Level', value: result.experienceLevel },
                { label: 'ATS Compatibility', value: `${result.atsCompatibility}/100` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-200 last:border-0">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs font-semibold text-slate-700">{value}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl space-y-3">
              <p className="text-sm font-semibold text-violet-800">🎯 Next Steps</p>
              <ol className="space-y-2">
                {[
                  'Address all high-priority suggestions first',
                  'Tailor this resume specifically to each job posting',
                  'Add quantifiable achievements to every role',
                  'Test your resume with ATS simulation tools',
                  'Ask a mentor or peer to review the final version',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-violet-700">
                    <span className="font-bold text-violet-400 flex-shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
