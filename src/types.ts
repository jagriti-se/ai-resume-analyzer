export interface ResumeScore {
  overall: number;
  sections: {
    formatting: number;
    keywords: number;
    experience: number;
    skills: number;
    education: number;
    impact: number;
  };
}

export interface Suggestion {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  score: ResumeScore;
  suggestions: Suggestion[];
  keywords: KeywordMatch[];
  strengths: string[];
  weaknesses: string[];
  atsCompatibility: number;
  readabilityScore: number;
  wordCount: number;
  estimatedReadTime: string;
  detectedSections: string[];
  missingCriticalSections: string[];
  jobTitleMatch: string;
  experienceLevel: string;
}

export type AnalysisStep = 'upload' | 'job-description' | 'analyzing' | 'results';
