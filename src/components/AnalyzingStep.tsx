import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { label: 'Parsing document structure…', icon: '📄', duration: 700 },
  { label: 'Extracting skills & experience…', icon: '🔍', duration: 600 },
  { label: 'Running ATS compatibility check…', icon: '🤖', duration: 700 },
  { label: 'Matching keywords to job description…', icon: '🔑', duration: 600 },
  { label: 'Scoring impact statements…', icon: '📈', duration: 600 },
  { label: 'Generating personalized suggestions…', icon: '✨', duration: 300 },
];

export default function AnalyzingStep() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((step, idx) => {
      const t = setTimeout(() => {
        setCurrentStep(idx);
        if (idx > 0) {
          setCompletedSteps(prev => [...prev, idx - 1]);
        }
      }, elapsed);
      timers.push(t);
      elapsed += step.duration;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const progress = ((completedSteps.length) / steps.length) * 100;

  return (
    <div className="py-4 space-y-8">
      {/* Animated orb */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 border-r-indigo-400"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-violet-300 border-l-indigo-300"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={currentStep}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl"
            >
              {steps[currentStep]?.icon}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-slate-500">Analyzing…</span>
          <span className="text-xs font-semibold text-violet-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isCompleted = completedSteps.includes(idx);
          const isActive = currentStep === idx && !isCompleted;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isActive || isCompleted ? 1 : 0.4, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                isActive ? 'bg-violet-50' : isCompleted ? 'bg-green-50' : ''
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCompleted ? 'bg-green-100' : isActive ? 'bg-violet-100' : 'bg-slate-100'
              }`}>
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500 text-xs"
                  >✓</motion.span>
                ) : isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-violet-500"
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </div>
              <span className={`text-sm ${
                isCompleted ? 'text-green-700' : isActive ? 'text-violet-700 font-medium' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-auto flex gap-0.5"
                  >
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 h-1 rounded-full bg-violet-400"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-400">
        This usually takes just a few seconds…
      </p>
    </div>
  );
}
