// =============================================================================
// Grader Types (Phase 3)
// =============================================================================

/** Which stage of the grader flow the user is on */
export type GraderStage =
  | 'connect'   // Google Ads OAuth connection
  | 'scanning'  // Loading / audit in progress
  | 'email-gate' // Email capture before report
  | 'report';   // Full audit report

/** One of the 6 audit categories */
export interface CategoryScore {
  /** Category identifier */
  id: string;
  /** Human-readable label */
  label: string;
  /** Score from 0–100 */
  score: number;
  /** Short summary of findings in this category */
  summary: string;
  /** Specific issues found */
  issues: string[];
}

/** One ranked fix item shown in the "Priority Fixes" section */
export interface PriorityFix {
  /** Rank (1 = highest impact) */
  rank: number;
  /** Short title */
  title: string;
  /** Detailed explanation */
  description: string;
  /** Estimated revenue impact (e.g. "+£12,000/month") */
  estimatedImpact: string;
  /** Which category this fix belongs to */
  category: string;
}

/** Full audit result returned from the grader analysis */
export interface AuditData {
  /** Overall grade (A–F) */
  overallGrade: string;
  /** Overall score from 0–100 */
  overallScore: number;
  /** Scores for each of the 6 categories */
  categories: CategoryScore[];
  /** Top 3–5 ranked fixes */
  priorityFixes: PriorityFix[];
  /** AI-generated executive summary */
  executiveSummary: string;
  /** ISO timestamp of when the audit was run */
  auditedAt: string;
  /** Google Ads account ID that was audited */
  accountId: string;
}

/** Full state object for the grader flow */
export interface GraderState {
  stage: GraderStage;
  auditData?: AuditData;
  isLoading: boolean;
  error?: string;
}
