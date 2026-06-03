import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ChevronRight, SkipForward, Sparkles } from 'lucide-react';

interface JobDescriptionStepProps {
  fileName: string;
  onNext: (jobDescription: string) => void;
  onBack: () => void;
}

const sampleJDs = [
  {
    label: 'Software Engineer',
    icon: '💻',
    text: `We are looking for a Senior Software Engineer to join our team. You will be responsible for designing and implementing scalable web applications.

Requirements:
• 5+ years of experience in software development
• Strong proficiency in JavaScript, TypeScript, and React
• Experience with Node.js and RESTful API design
• Familiarity with AWS, Docker, and Kubernetes
• Experience with SQL and NoSQL databases (PostgreSQL, MongoDB)
• Strong understanding of CI/CD pipelines and Agile methodologies
• Excellent problem-solving and communication skills
• Experience with Git and code review processes`,
  },
  {
    label: 'Data Scientist',
    icon: '📊',
    text: `We are seeking a Data Scientist to extract insights from large datasets and build machine learning models.

Requirements:
• 3+ years of experience in data science or machine learning
• Strong proficiency in Python and data analysis libraries (pandas, NumPy, scikit-learn)
• Experience with SQL and big data technologies
• Familiarity with deep learning frameworks (TensorFlow, PyTorch)
• Strong analytical and communication skills
• Experience with data visualization tools
• Knowledge of statistical modeling and A/B testing`,
  },
  {
    label: 'Product Manager',
    icon: '🚀',
    text: `We are hiring a Product Manager to define product vision and drive cross-functional teams.

Requirements:
• 4+ years of product management experience
• Proven track record of launching successful products
• Strong leadership and communication skills
• Data-driven mindset with experience in analytics tools
• Ability to collaborate with engineering, design, and business stakeholders
• Experience with Agile and Scrum methodologies
• Strategic thinking and innovation skills`,
  },
];

export default function JobDescriptionStep({ fileName, onNext, onBack }: JobDescriptionStepProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);

  const handleTemplate = (idx: number) => {
    setActiveTemplate(idx);
    setJobDescription(sampleJDs[idx].text);
  };

  const wordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* File indicator */}
      <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 border border-violet-100 rounded-xl">
        <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs">📄</span>
        </div>
        <p className="text-sm text-violet-700 font-medium truncate">{fileName}</p>
        <span className="ml-auto text-xs text-violet-400 flex-shrink-0">Uploaded ✓</span>
      </div>

      {/* Quick fill templates */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
          Quick fill templates
        </p>
        <div className="flex gap-2 flex-wrap">
          {sampleJDs.map((jd, idx) => (
            <button
              key={idx}
              onClick={() => handleTemplate(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                activeTemplate === idx
                  ? 'border-violet-300 bg-violet-50 text-violet-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50'
              }`}
            >
              <span>{jd.icon}</span>
              {jd.label}
            </button>
          ))}
          <button
            onClick={() => { setJobDescription(''); setActiveTemplate(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all duration-150"
          >
            + Custom
          </button>
        </div>
      </div>

      {/* Text area */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <label className="text-sm font-medium text-slate-700">Paste the job description</label>
          <span className="text-xs text-slate-400">(optional but recommended)</span>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => { setJobDescription(e.target.value); setActiveTemplate(null); }}
          placeholder="Paste the full job description here to get keyword-matched analysis and tailored suggestions...&#10;&#10;This helps us identify missing skills, keyword gaps, and ATS compatibility with the specific role."
          className="w-full h-52 rounded-2xl border-2 border-slate-200 p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors resize-none bg-slate-50"
        />
        <div className="absolute bottom-3 right-4 flex items-center gap-2">
          {wordCount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-slate-400"
            >
              {wordCount} words
            </motion.span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {jobDescription.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl"
          >
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Great!</span> We'll tailor keyword analysis and suggestions specifically to this job description for a more accurate match score.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => onNext('')}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </button>
        <button
          onClick={() => onNext(jobDescription)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          Analyze Resume
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
