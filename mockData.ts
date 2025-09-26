import { TestReport, ReportListItem } from './types';

export const mockReports: ReportListItem[] = [
    {
        report_id: "run-1689345600",
        timestamp: "2023-07-14T12:00:00Z",
        summary: { total_tests: 10, passed: 9, failed: 1 },
    },
    {
        report_id: "run-1689259200",
        timestamp: "2023-07-13T12:00:00Z",
        summary: { total_tests: 10, passed: 10, failed: 0 },
    },
];

export const mockReportDetails: TestReport = {
    report_id: "run-1689345600",
    timestamp: "2023-07-14T12:00:00Z",
    summary: {
        total_tests: 10,
        passed: 9,
        failed: 1,
        inconclusive: 0,
        pass_rate: "90.0%",
    },
    triage_notes: {
        "TC-GAME-003": "Investigate potential timing issue on level 5.",
    },
    test_cases: [
        {
            test_case_id: "TC-GAME-001",
            description: "Verify main menu loads correctly.",
            verdict: "pass",
            executor_agent_id: "executor-alpha",
            reproducibility: { repeat_count: 2, pass_count: 2, consistency: "100%" },
            cross_agent_validation: { "executor-beta": "pass" },
            steps: [
                { step_number: 1, action: "Navigate to homepage", expected_result: "Main menu is visible", actual_result: "Main menu is visible", verdict: "pass", artifacts: {} },
            ],
        },
        {
            test_case_id: "TC-GAME-002",
            description: "Start a new game and verify level 1 loads.",
            verdict: "pass",
            executor_agent_id: "executor-beta",
            reproducibility: { repeat_count: 2, pass_count: 2, consistency: "100%" },
            cross_agent_validation: { "executor-alpha": "pass" },
            steps: [
                { step_number: 1, action: "Click 'New Game' button", expected_result: "Game board for level 1 is displayed", actual_result: "Game board for level 1 is displayed", verdict: "pass", artifacts: { screenshot_path: "/artifacts/TC-GAME-002/step1.png" } },
            ],
        },
        {
            test_case_id: "TC-GAME-003",
            description: "Solve level 1 and verify level 2 loads.",
            verdict: "fail",
            executor_agent_id: "executor-alpha",
            reproducibility: { repeat_count: 2, pass_count: 0, consistency: "0%" },
            cross_agent_validation: { "executor-beta": "fail" },
            steps: [
                { step_number: 1, action: "Enter correct solution for level 1", expected_result: "Success message appears", actual_result: "Success message appears", verdict: "pass", artifacts: {} },
                { step_number: 2, action: "Click 'Next Level' button", expected_result: "Level 2 game board is displayed", actual_result: "Spinner displayed indefinitely, level 2 did not load", verdict: "fail", artifacts: { screenshot_path: "/artifacts/TC-GAME-003/step2.png", dom_snapshot_path: "/artifacts/TC-GAME-003/step2.html" } },
            ],
        },
        ...Array.from({ length: 7 }, (_, i) => ({
             test_case_id: `TC-GAME-${String(i + 4).padStart(3, '0')}`,
            description: `Verify functionality of puzzle element ${i+1}.`,
            verdict: "pass" as "pass",
            executor_agent_id: i % 2 === 0 ? "executor-alpha" : "executor-beta",
            reproducibility: { repeat_count: 2, pass_count: 2, consistency: "100%" },
            // Fix: Cast "pass" to the literal type 'pass' to match the type definition.
            cross_agent_validation: { [i % 2 !== 0 ? "executor-alpha" : "executor-beta"]: "pass" as "pass" },
            steps: [
                { step_number: 1, action: `Interact with element ${i+1}`, expected_result: "Correct behavior observed", actual_result: "Correct behavior observed", verdict: "pass" as "pass", artifacts: {} },
            ],
        }))
    ],
};