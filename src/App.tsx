import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ArrowRight } from 'lucide-react';
import { AnalysisStep, AnalysisResult } from './types';
import { analyzeResume } from './utils/analyzer';
import UploadStep from './components/UploadStep';
import JobDescriptionStep from './components/JobDescriptionStep';
import AnalyzingStep from './components/AnalyzingStep';
import ResultsStep from './components/ResultsStep';

const STEP_CONFIG: Record<AnalysisStep, { title: string; subtitle: string; step: number }> = {
  upload: { title: 'Upload Your Resume', subtitle: 'Supports PDF, DOC, DOCX, and TXT formats', step: 1 },
  'job-description': { title: 'Add Job Description', subtitle: 'Get tailored keyword analysis', step: 2 },
  analyzing: { title: 'AI Analyzing…', subtitle: 'Running deep analysis on your resume', step: 3 },
  results: { title: 'Analysis Complete', subtitle: 'Here are your personalized insights', step: 4 },
};

const STATS = [
  { value: '98%', label: 'ATS Accuracy', icon: '🎯' },
  { value: '50K+', label: 'Resumes Analyzed', icon: '📄' },
  { value: '4.9★', label: 'User Rating', icon: '⭐' },
  { value: '< 10s', label: 'Analysis Time', icon: '⚡' },
];

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Advanced NLP to parse and evaluate your resume with precision.' },
  { icon: '🎯', title: 'ATS Optimization', desc: 'Ensure your resume passes Applicant Tracking System filters.' },
  { icon: '🔑', title: 'Keyword Matching', desc: 'Compare your resume against the job description intelligently.' },
  { icon: '📊', title: 'Score Breakdown', desc: 'Detailed scores across 6 key resume dimensions.' },
  { icon: '💡', title: 'Actionable Tips', desc: 'Specific, prioritized suggestions to improve your resume.' },
  { icon: '⚡', title: 'Instant Results', desc: 'Get comprehensive feedback in under 10 seconds.' },
];

export default function App() {
  const [step, setStep] = useState<AnalysisStep>('upload');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);


  const handleUploadNext = (text: string, name: string) => {
    setResumeText(text);
    setFileName(name);
    setStep('job-description');
  };

  const handleJDNext = async (jd: string) => {
    setStep('analyzing');
    try {
      const analysis = await analyzeResume(resumeText, jd);
      setResult(analysis);
      setStep('results');
    } catch {
      setStep('upload');
    }
  };

  const handleReset = () => {
    setStep('upload');
    setResumeText('');
    setFileName('');
    setResult(null);
  };

  const config = STEP_CONFIG[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Brain className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">ResumeAI</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          </div>
          <button
            onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/10 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            Analyze Now
          </button>
        </nav>

        {/* Hero Section */}
        <section className="px-6 pt-12 pb-16 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              AI-Powered Resume Analysis
              <Sparkles className="w-3 h-3" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Get Your Resume{' '}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                AI-Analyzed
              </span>
              {' '}in Seconds
            </h1>

            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Upload your resume and get instant, actionable feedback. Score your ATS compatibility, keyword density, formatting, and more — all powered by advanced AI.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-violet-500/30 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Analyze My Resume Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ======= ANALYZER CARD ======= */}
        <section id="analyzer" className="px-4 pb-16">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5">
                {/* Progress steps */}
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        s < config.step
                          ? 'bg-white text-violet-600'
                          : s === config.step
                          ? 'bg-white/20 text-white border-2 border-white'
                          : 'bg-white/10 text-white/40'
                      }`}>
                        {s < config.step ? '✓' : s}
                      </div>
                      {s < 4 && (
                        <div className={`flex-1 h-0.5 mx-1 rounded transition-all duration-300 ${
                          s < config.step ? 'bg-white' : 'bg-white/20'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-white font-bold text-xl">{config.title}</h2>
                    <p className="text-violet-200 text-sm mt-0.5">{config.subtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card body */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 'upload' && (
                    <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <UploadStep onNext={handleUploadNext} />
                    </motion.div>
                  )}
                  {step === 'job-description' && (
                    <motion.div key="jd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <JobDescriptionStep
                        fileName={fileName}
                        onNext={handleJDNext}
                        onBack={() => setStep('upload')}
                      />
                    </motion.div>
                  )}
                  {step === 'analyzing' && (
                    <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <AnalyzingStep />
                    </motion.div>
                  )}
                  {step === 'results' && result && (
                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ResultsStep result={result} fileName={fileName} onReset={handleReset} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              {['🔒 Private & Secure', '✓ No Sign-up Required', '⚡ Instant Results', '🆓 100% Free'].map(badge => (
                <span key={badge} className="text-xs text-slate-400 font-medium">{badge}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need to land the job</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Our AI analyzes every aspect of your resume to give you a competitive edge in the job market.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-all duration-200 group hover:-translate-y-1"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="px-6 py-16 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
            <p className="text-slate-400">Three simple steps to a better resume</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drop your PDF, Word doc, or paste your resume text directly.', icon: '📤' },
              { step: '02', title: 'Add Job Description', desc: 'Optionally paste the job posting for targeted keyword analysis.', icon: '📋' },
              { step: '03', title: 'Get Results', desc: 'Receive your score, keyword gaps, and actionable improvement tips.', icon: '🎯' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-5xl font-black text-violet-500/30 mb-2">{item.step}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="px-6 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/30 backdrop-blur-sm"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-3">Ready to improve your resume?</h2>
            <p className="text-slate-300 mb-6">Join thousands of job seekers who've boosted their interview rate with AI-powered resume analysis.</p>
            <button
              onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold hover:from-violet-400 hover:to-indigo-400 transition-all duration-200 shadow-lg shadow-violet-500/30 hover:-translate-y-0.5"
            >
              Analyze My Resume — It's Free
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">ResumeAI</span>
            </div>
            <p className="text-xs text-slate-500">© 2025 ResumeAI. Built with ❤️ for job seekers everywhere.</p>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
