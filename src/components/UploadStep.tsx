import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface UploadStepProps {
  onNext: (text: string, fileName: string) => void;
}

export default function UploadStep({ onNext }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setError('');
    setFile(f);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResumeText(text || generateSampleText());
    };
    reader.onerror = () => {
      setResumeText(generateSampleText());
    };
    reader.readAsText(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => setError('File rejected. Please upload a PDF, DOC, DOCX, or TXT file under 5MB.'),
  });

  const handleContinue = () => {
    const textToAnalyze = mode === 'paste' ? resumeText : (resumeText || '');
    if (mode === 'upload' && !file) {
      setError('Please upload a resume file first.');
      return;
    }
    if (mode === 'paste' && !resumeText.trim()) {
      setError('Please paste your resume text.');
      return;
    }
    if (!textToAnalyze.trim()) {
      setError('Could not extract text. Please try pasting your resume.');
      return;
    }
    onNext(textToAnalyze, file?.name || 'Pasted Resume');
  };

  const removeFile = () => {
    setFile(null);
    setResumeText('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
        {(['upload', 'paste'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); setFile(null); setResumeText(''); }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === m
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {m === 'upload' ? '📎 Upload File' : '📋 Paste Text'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {!file ? (
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-violet-400 bg-violet-50 scale-[1.01]'
                    : 'border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/50'
                }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                    isDragActive ? 'bg-violet-100' : 'bg-white shadow-sm'
                  }`}>
                    <Upload className={`w-8 h-8 transition-colors ${isDragActive ? 'text-violet-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="text-slate-700 font-semibold text-lg">
                      {isDragActive ? 'Drop it here!' : 'Drop your resume here'}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">or click to browse files</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {['PDF', 'DOC', 'DOCX', 'TXT'].map(ext => (
                      <span key={ext} className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-xs text-slate-500 font-medium">
                        {ext}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">Maximum file size: 5MB</p>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-green-200 bg-green-50 rounded-2xl p-6 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB · Ready to analyze
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <button
                    onClick={removeFile}
                    className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              value={resumeText}
              onChange={(e) => { setResumeText(e.target.value); setError(''); }}
              placeholder="Paste your resume text here...&#10;&#10;Include your full resume content for the most accurate analysis."
              className="w-full h-56 rounded-2xl border-2 border-slate-200 p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors resize-none bg-slate-50"
            />
            <p className="text-xs text-slate-400 mt-2 text-right">
              {resumeText.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Try Sample */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <button
          onClick={() => {
            setMode('paste');
            setResumeText(generateSampleText());
            setError('');
          }}
          className="text-xs text-violet-500 hover:text-violet-700 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Try with sample resume
        </button>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        Continue →
      </button>
    </div>
  );
}

function generateSampleText(): string {
  return `John Smith
john.smith@email.com | (555) 123-4567 | linkedin.com/in/johnsmith | San Francisco, CA

SUMMARY
Results-driven Software Engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and delivering high-impact solutions. Led cross-functional teams and shipped products used by over 2 million users.

EXPERIENCE

Senior Software Engineer — TechCorp Inc., San Francisco, CA (2021–Present)
• Led development of a React-based dashboard that increased user engagement by 42%
• Managed a team of 6 engineers to deliver a microservices migration ahead of schedule
• Optimized database queries reducing API response time by 65%, saving $200K/year in infrastructure costs
• Implemented CI/CD pipelines using GitHub Actions and Docker, improving deployment frequency by 80%

Software Engineer — StartupXYZ, Remote (2019–2021)
• Developed RESTful APIs with Node.js and PostgreSQL powering 500K+ daily active users
• Built responsive UI components in React and TypeScript with 98% test coverage
• Collaborated with product and design teams to launch 3 major product features on schedule

EDUCATION
B.S. Computer Science — University of California, Berkeley (2019)
GPA: 3.8/4.0 | Dean's List | Relevant coursework: Algorithms, Distributed Systems, ML

SKILLS
Languages: JavaScript, TypeScript, Python, Java, SQL
Frameworks: React, Node.js, Express, GraphQL, REST API
Tools: Docker, Kubernetes, AWS, Git, Agile, MongoDB, PostgreSQL

CERTIFICATIONS
• AWS Certified Solutions Architect (2022)
• Google Cloud Professional Developer (2023)

PROJECTS
Open Source CLI Tool — 1,200 GitHub stars | Built a developer productivity tool with 10,000+ downloads
Personal Finance App — React Native app with 4.8★ rating on the App Store`;
}
