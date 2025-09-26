// The overall status of the test run process
export enum TestStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  RANKING = 'RANKING',
  EXECUTING = 'EXECUTING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

// Artifacts captured for a single test step
export interface Artifacts {
  screenshot_path?: string;
  dom_snapshot_path?: string;
  console_log_path?: string;
  network_capture_path?: string;
}

// A single step within a test case
export interface TestStep {
  step_number: number;
  action: string;
  expected_result: string;
  actual_result: string;
  verdict: 'pass' | 'fail' | 'inconclusive';
  artifacts: Artifacts;
}

// The result of a single executed test case
export interface TestCaseResult {
  test_case_id: string;
  description: string;
  verdict: 'pass' | 'fail' | 'inconclusive';
  steps: TestStep[];
  executor_agent_id: string;
  reproducibility: {
    repeat_count: number;
    pass_count: number;
    consistency: string;
  };
  cross_agent_validation: {
    [agentId: string]: 'pass' | 'fail';
  };
}

// The comprehensive final report for a test run
export interface TestReport {
  report_id: string;
  timestamp: string;
  summary: {
    total_tests: number;
    passed: number;
    failed: number;
    inconclusive: number;
    pass_rate: string;
  };
  test_cases: TestCaseResult[];
  triage_notes: {
    [test_case_id: string]: string;
  };
}

// Simplified report info for list display
export interface ReportListItem {
    report_id: string;
    timestamp: string;
    summary: {
        total_tests: number;
        passed: number;
        failed: number;
    }
}
