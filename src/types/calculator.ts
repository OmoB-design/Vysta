// =============================================================================
// Calculator Types
// =============================================================================

/** Which ad platform the brand is running (shown on Step 1) */
export type Platform = 'google' | 'meta' | 'both' | 'neither' | 'tiktok' | 'linkedin' | 'other';

/** The three inputs collected across three calculator steps */
export interface CalculatorInputs {
  /** Monthly ad spend in GBP/USD */
  monthlySpend: number;
  /** Current ROAS (e.g. 3.2 means £3.20 back per £1 spent) */
  currentRoas: number;
  /** Which platform they're primarily advertising on */
  platform: Platform;
}

/** The calculated output — returned by the math engine */
export interface CalculatorResults {
  /** Revenue the brand currently generates from ads */
  currentRevenue: number;
  /** Revenue they'd generate at Adcubator's 8.78x benchmark ROAS */
  projectedRevenue: number;
  /** Monthly difference between projected and current revenue */
  monthlyGap: number;
  /** Annual difference (monthlyGap × 12) */
  annualGap: number;
  /** AI-generated insight paragraph (filled after Claude call) */
  aiInsight?: string;
}

/** Which step of the calculator flow the user is on */
export type CalculatorStep =
  | 'platform'   // Step 1: which platform?
  | 'spend'      // Step 2: monthly ad spend
  | 'roas'       // Step 3: current ROAS
  | 'email-gate' // Email capture before results
  | 'results';   // Results screen

/** Full state object for the calculator flow */
export interface CalculatorState {
  step: CalculatorStep;
  inputs: Partial<CalculatorInputs>;
  results?: CalculatorResults;
  isLoading: boolean;
  error?: string;
}

/** Payload sent to /api/calculator/leads */
export interface LeadPayload {
  firstName: string;
  email: string;
  consented: boolean;
  inputs: CalculatorInputs;
  results: CalculatorResults;
}
