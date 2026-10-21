export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface BottleneckItem {
  id: string;
  category: 'database' | 'api' | 'concurrency' | 'mobile' | 'security';
  title: string;
  description: string;
  impact: string;
  severity: SeverityLevel;
  gasLimitContext: string;
  recommendedSolution: string;
}

export interface MetricScore {
  label: string;
  currentScore: number; // 0 - 100
  targetScore: number;
  unit: string;
  currentValue: string;
  targetValue: string;
  status: 'critical' | 'warning' | 'optimal';
}

export interface TechnicalRecommendation {
  id: string;
  domain: 'Database & Storage' | 'API & Gateway' | 'Backend Caching' | 'Android & Mobile Client' | 'Security & Auth';
  title: string;
  summary: string;
  currentArchitecture: string;
  proposedArchitecture: string;
  expectedGain: string;
  implementationEffort: 'Rendah (1-2 hari)' | 'Sedang (1-2 minggu)' | 'Tinggi (3-4 minggu)';
  priority: 'P0 - Urgent' | 'P1 - High' | 'P2 - Medium';
  keyTechStack: string[];
  actionSteps: string[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  name: string;
  duration: string;
  status: 'planned' | 'in_progress' | 'completed';
  objective: string;
  deliverables: string[];
  riskMitigation: string;
}

export interface AppLinks {
  sourceSheetUrl?: string;
  destinationSheetUrl?: string;
  gasScriptUrl?: string;
  webAppDeploymentUrl?: string;
  repoUrl?: string;
}

export type SupervisionStatus = 
  | 'audit'
  | 'refactoring_gas'
  | 'database_migration'
  | 'android_dev'
  | 'production_ready';

export interface AttachedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  dataUrl?: string;
}

export interface AppProject {
  id: string;
  name: string;
  category: string;
  description: string;
  links?: AppLinks;
  criticalNotes?: string;
  leadRecommendationNotes?: string;
  supervisionStatus?: SupervisionStatus;
  targetDatabase?: 'postgresql' | 'firestore' | 'hybrid_sync' | 'optimized_gas';
  attachedDocs?: AttachedDocument[];
  currentStack: {
    frontend: string;
    backend: string;
    database: string;
    auth: string;
  };
  metrics: {
    dailyActiveUsers: number;
    peakRequestsPerMinute: number;
    totalRows: number;
    avgLatencyMs: number;
    errorRatePercent: number;
  };
  scores: MetricScore[];
  bottlenecks: BottleneckItem[];
  recommendations: TechnicalRecommendation[];
  roadmap: RoadmapPhase[];
  codeSnippets: {
    title: string;
    language: string;
    description: string;
    legacyGasCode?: string;
    optimizedCode: string;
  }[];
}

