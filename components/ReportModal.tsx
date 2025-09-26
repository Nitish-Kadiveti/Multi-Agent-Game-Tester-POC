import React, { useState } from 'react';
import { TestReport, TestCaseResult, TestStep } from '../types';
import { ArrowDownOnSquareIcon, CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, LinkIcon, XCircleIcon, InformationCircleIcon } from './Icons';

interface ReportModalProps {
  report: TestReport | null;
  isLoading: boolean;
  onClose: () => void;
}

const VerdictIcon: React.FC<{ verdict: 'pass' | 'fail' | 'inconclusive' }> = ({ verdict }) => {
  if (verdict === 'pass') return <CheckCircleIcon className="h-5 w-5 text-status-green" />;
  if (verdict === 'fail') return <XCircleIcon className="h-5 w-5 text-status-red" />;
  return <InformationCircleIcon className="h-5 w-5 text-status-yellow" />;
};

const TestCase: React.FC<{ testCase: TestCaseResult }> = ({ testCase }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-gray-light rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
                <div className="flex items-center">
                    <VerdictIcon verdict={testCase.verdict} />
                    <span className="ml-3 font-semibold text-white">{testCase.test_case_id}</span>
                </div>
                <div className="flex items-center">
                    <p className="text-sm text-gray-400 mr-4">{testCase.description}</p>
                    {isOpen ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
                </div>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="bg-gray-medium p-3 rounded"><strong>Executor:</strong> {testCase.executor_agent_id}</div>
                        <div className="bg-gray-medium p-3 rounded"><strong>Reproducibility:</strong> {testCase.reproducibility.consistency} ({testCase.reproducibility.pass_count}/{testCase.reproducibility.repeat_count} passes)</div>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Steps:</h4>
                    <div className="space-y-2">
                        {testCase.steps.map(step => <TestStepView key={step.step_number} step={step} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

const TestStepView: React.FC<{ step: TestStep }> = ({ step }) => (
    <div className="bg-gray-medium p-3 rounded-lg">
        <div className="flex items-start justify-between">
            <div className="flex items-start">
                <VerdictIcon verdict={step.verdict} />
                <p className="ml-3 text-white"><strong className="font-semibold">Step {step.step_number}:</strong> {step.action}</p>
            </div>
            <div className="flex items-center space-x-2">
                {step.artifacts.screenshot_path && <a href={step.artifacts.screenshot_path} target="_blank" rel="noopener noreferrer" title="Screenshot"><LinkIcon className="h-4 w-4 text-brand-accent hover:underline"/></a>}
                {step.artifacts.dom_snapshot_path && <a href={step.artifacts.dom_snapshot_path} target="_blank" rel="noopener noreferrer" title="DOM Snapshot"><LinkIcon className="h-4 w-4 text-brand-accent hover:underline"/></a>}
            </div>
        </div>
    </div>
);


export const ReportModal: React.FC<ReportModalProps> = ({ report, isLoading, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-medium rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <header className="p-4 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{isLoading ? 'Loading Report...' : `Report: ${report?.report_id}`}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <ArrowDownOnSquareIcon className="animate-spin h-8 w-8 text-brand-accent"/>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-light p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Execution Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div><p className="text-2xl font-bold">{report.summary.total_tests}</p><p className="text-sm text-gray-400">Total Tests</p></div>
                    <div><p className="text-2xl font-bold text-status-green">{report.summary.passed}</p><p className="text-sm text-gray-400">Passed</p></div>
                    <div><p className="text-2xl font-bold text-status-red">{report.summary.failed}</p><p className="text-sm text-gray-400">Failed</p></div>
                    <div><p className="text-2xl font-bold text-status-green">{report.summary.pass_rate}</p><p className="text-sm text-gray-400">Pass Rate</p></div>
                  </div>
              </div>

              {/* Test Cases */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Test Cases</h3>
                <div className="space-y-3">
                  {report.test_cases.map(tc => <TestCase key={tc.test_case_id} testCase={tc} />)}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400">Could not load report details.</p>
          )}
        </div>
      </div>
    </div>
  );
};
