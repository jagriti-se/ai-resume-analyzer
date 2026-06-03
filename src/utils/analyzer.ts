import { AnalysisResult, KeywordMatch, Suggestion } from '../types';

// Simulate AI analysis with realistic logic
export function analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = performAnalysis(resumeText, jobDescription);
      resolve(result);
    }, 3500);
  });
}

function performAnalysis(resumeText: string, jobDescription: string): AnalysisResult {
  const text = resumeText.toLowerCase();
  const jdText = jobDescription.toLowerCase();

  // --- Word count ---
  const words = resumeText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // --- Detected sections ---
  const allSections = [
    'summary', 'objective', 'experience', 'work experience', 'employment',
    'education', 'skills', 'technical skills', 'projects', 'certifications',
    'awards', 'publications', 'volunteer', 'languages', 'references', 'achievements'
  ];
  const detectedSections = allSections.filter(s => text.includes(s))
    .map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

  if (detectedSections.length < 3) {
    detectedSections.push('Experience', 'Education', 'Skills');
  }

  const criticalSections = ['Summary', 'Experience', 'Education', 'Skills'];
  const missingCriticalSections = criticalSections.filter(
    s => !detectedSections.some(d => d.toLowerCase().includes(s.toLowerCase()))
  );

  // --- Keywords ---
  const techKeywords = [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'rest api', 'graphql', 'mongodb', 'postgresql',
    'machine learning', 'data analysis', 'ci/cd', 'microservices', 'java', 'css', 'html'
  ];
  const softKeywords = [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'collaboration', 'management', 'strategy', 'innovation', 'mentoring'
  ];
  const actionVerbs = [
    'led', 'managed', 'developed', 'designed', 'implemented', 'increased', 'reduced',
    'launched', 'achieved', 'delivered', 'optimized', 'built', 'created', 'improved'
  ];

  const jdKeywords = jdText
    ? [...techKeywords, ...softKeywords].filter(k => jdText.includes(k))
    : techKeywords.slice(0, 12);

  const keywords: KeywordMatch[] = [
    ...jdKeywords.slice(0, 8).map(k => ({
      keyword: k,
      found: text.includes(k),
      importance: 'high' as const,
    })),
    ...softKeywords.slice(0, 5).map(k => ({
      keyword: k,
      found: text.includes(k),
      importance: 'medium' as const,
    })),
    ...actionVerbs.slice(0, 5).map(k => ({
      keyword: k,
      found: text.includes(k),
      importance: 'low' as const,
    })),
  ];

  // --- Score computation ---
  const foundHighKw = keywords.filter(k => k.importance === 'high' && k.found).length;
  const totalHighKw = keywords.filter(k => k.importance === 'high').length;
  const keywordsScore = Math.round((foundHighKw / Math.max(totalHighKw, 1)) * 100);

  const formattingScore = wordCount > 300 && wordCount < 800 ? 88
    : wordCount > 150 ? 72 : 55;

  const hasMetrics = /\d+%|\$\d+|\d+ (people|team|employees|projects|million|thousand)/i.test(resumeText);
  const hasActionVerbs = actionVerbs.filter(v => text.includes(v)).length;
  const impactScore = Math.min(100, 40 + (hasMetrics ? 30 : 0) + hasActionVerbs * 4);

  const expScore = detectedSections.some(s => s.toLowerCase().includes('experience'))
    ? Math.min(100, 60 + (hasMetrics ? 20 : 0) + Math.min(wordCount / 20, 20))
    : 40;

  const skillsScore = detectedSections.some(s => s.toLowerCase().includes('skill'))
    ? Math.min(100, 50 + foundHighKw * 5)
    : 35;

  const educationScore = detectedSections.some(s => s.toLowerCase().includes('education'))
    ? 85 : 50;

  const overall = Math.round(
    (formattingScore * 0.2 + keywordsScore * 0.25 + expScore * 0.2 +
      skillsScore * 0.15 + educationScore * 0.1 + impactScore * 0.1)
  );

  // --- ATS compatibility ---
  const atsCompatibility = Math.min(100, overall - 5 + (missingCriticalSections.length === 0 ? 10 : 0));

  // --- Readability ---
  const avgWordsPerSentence = wordCount / Math.max(resumeText.split(/[.!?]/).length, 1);
  const readabilityScore = avgWordsPerSentence < 20 ? 85 : avgWordsPerSentence < 30 ? 70 : 55;

  // --- Suggestions ---
  const suggestions: Suggestion[] = [];

  if (missingCriticalSections.length > 0) {
    suggestions.push({
      id: 'missing-sections',
      type: 'error',
      category: 'Structure',
      title: `Missing critical section${missingCriticalSections.length > 1 ? 's' : ''}: ${missingCriticalSections.join(', ')}`,
      description: 'These sections are expected by ATS systems and recruiters. Add them to significantly improve your resume\'s effectiveness.',
      priority: 'high',
    });
  }

  if (!hasMetrics) {
    suggestions.push({
      id: 'no-metrics',
      type: 'warning',
      category: 'Impact',
      title: 'Add quantifiable achievements',
      description: 'Resumes with numbers and metrics (e.g., "increased revenue by 30%", "managed a team of 8") perform 40% better with recruiters.',
      priority: 'high',
    });
  }

  if (wordCount < 300) {
    suggestions.push({
      id: 'too-short',
      type: 'warning',
      category: 'Content',
      title: 'Resume may be too brief',
      description: `Your resume has ${wordCount} words. Aim for 400–700 words for a 1-page resume to provide enough context for ATS and recruiters.`,
      priority: 'high',
    });
  }

  if (wordCount > 900) {
    suggestions.push({
      id: 'too-long',
      type: 'warning',
      category: 'Formatting',
      title: 'Consider condensing your resume',
      description: `At ${wordCount} words, your resume may be too long. Recruiters spend an average of 7 seconds on initial screening — keep it concise.`,
      priority: 'medium',
    });
  }

  if (keywordsScore < 60) {
    suggestions.push({
      id: 'low-keywords',
      type: 'error',
      category: 'Keywords',
      title: 'Low keyword match with job description',
      description: 'Your resume is missing many keywords from the job description. Tailor your skills and experience sections to mirror the job posting language.',
      priority: 'high',
    });
  }

  if (hasActionVerbs < 5) {
    suggestions.push({
      id: 'weak-verbs',
      type: 'warning',
      category: 'Language',
      title: 'Use stronger action verbs',
      description: 'Begin bullet points with powerful action verbs like "Led", "Implemented", "Delivered" to convey impact and ownership.',
      priority: 'medium',
    });
  }

  suggestions.push({
    id: 'linkedin',
    type: 'info',
    category: 'Contact Info',
    title: 'Include your LinkedIn profile URL',
    description: 'Adding a LinkedIn URL increases profile views and gives recruiters an easy way to learn more about you.',
    priority: 'medium',
  });

  if (formattingScore > 80) {
    suggestions.push({
      id: 'good-format',
      type: 'success',
      category: 'Formatting',
      title: 'Great resume length and structure',
      description: 'Your resume appears to be well-structured with an ideal word count for readability and ATS parsing.',
      priority: 'low',
    });
  }

  if (foundHighKw > totalHighKw * 0.6) {
    suggestions.push({
      id: 'good-keywords',
      type: 'success',
      category: 'Keywords',
      title: 'Strong keyword alignment',
      description: 'Your resume contains many of the key technical terms from the job description — great for passing ATS filters.',
      priority: 'low',
    });
  }

  suggestions.push({
    id: 'file-format',
    type: 'info',
    category: 'ATS',
    title: 'Submit as a clean, ATS-friendly PDF',
    description: 'Avoid tables, columns, headers/footers, and graphics that can confuse ATS parsers. Use a single-column layout.',
    priority: 'low',
  });

  // --- Strengths & Weaknesses ---
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (hasMetrics) strengths.push('Contains quantifiable achievements with metrics');
  if (detectedSections.length >= 4) strengths.push('Well-structured with multiple clear sections');
  if (foundHighKw >= totalHighKw * 0.5) strengths.push('Good alignment with job description keywords');
  if (hasActionVerbs >= 5) strengths.push('Uses strong, impactful action verbs');
  if (wordCount >= 300 && wordCount <= 800) strengths.push('Ideal resume length for readability');
  if (readabilityScore > 75) strengths.push('Clear and concise writing style');
  if (strengths.length === 0) strengths.push('Resume submitted for review');

  if (!hasMetrics) weaknesses.push('Lacks quantifiable metrics and achievements');
  if (keywordsScore < 60) weaknesses.push('Keyword match with job description is low');
  if (missingCriticalSections.length > 0) weaknesses.push(`Missing key sections: ${missingCriticalSections.join(', ')}`);
  if (hasActionVerbs < 5) weaknesses.push('Bullet points lack strong action verbs');
  if (wordCount < 300) weaknesses.push('Resume content is too brief');
  if (weaknesses.length === 0) weaknesses.push('Minor improvements possible in keyword density');

  // --- Job title / experience level ---
  const jobTitleMatch = jdText.includes('senior') ? 'Senior Developer'
    : jdText.includes('junior') ? 'Junior Developer'
    : jdText.includes('manager') ? 'Engineering Manager'
    : jdText.includes('data') ? 'Data Scientist'
    : jdText.includes('design') ? 'UX/UI Designer'
    : 'Software Engineer';

  const experienceLevel = wordCount > 700 ? 'Senior (7+ years)'
    : wordCount > 450 ? 'Mid-level (3–6 years)'
    : 'Junior (0–2 years)';

  return {
    score: {
      overall,
      sections: {
        formatting: formattingScore,
        keywords: keywordsScore,
        experience: Math.round(expScore),
        skills: skillsScore,
        education: educationScore,
        impact: impactScore,
      },
    },
    suggestions,
    keywords,
    strengths,
    weaknesses,
    atsCompatibility,
    readabilityScore,
    wordCount,
    estimatedReadTime: `${Math.ceil(wordCount / 200)} min`,
    detectedSections,
    missingCriticalSections,
    jobTitleMatch,
    experienceLevel,
  };
}
