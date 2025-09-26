import React, { useState, useEffect, useCallback } from 'react';
import { TestStatus, TestReport, ReportListItem } from './types';
import { Header } from './components/Header';
import { StatusIndicator } from './components/StatusIndicator';
import { ReportModal } from './components/ReportModal';
import { mockReports, mockReportDetails } from './mockData';
import { DocumentTextIcon, ChevronRightIcon, PlayIcon, ArrowPathIcon } from './components/Icons';

const App: React.FC = () => {
  const [status, setStatus] = useState<TestStatus>(TestStatus.IDLE);
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(true);
  const [isLoadingReportDetails, setIsLoadingReportDetails] = useState<boolean>(false);
  
  // Mocks API call to fetch report list
  const fetchReports = useCallback(() => {
    setIsLoadingReports(true);
    console.log("Fetching reports...");
    setTimeout(() => {
      setReports(mockReports);
      setIsLoadingReports(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Mocks the entire multi-agent test run process
  const handleStartTestRun = () => {
    if (status !== TestStatus.IDLE && status !== TestStatus.COMPLETE && status !== TestStatus.ERROR) {
        return;
    }
    
    const statuses: TestStatus[] = [
        TestStatus.PLANNING,
        TestStatus.RANKING,
        TestStatus.EXECUTING,
        TestStatus.ANALYZING,
        TestStatus.COMPLETE
    ];
    
    let currentIndex = 0;
    setStatus(statuses[currentIndex]);

    const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex < statuses.length) {
            setStatus(statuses[currentIndex]);
        } else {
            clearInterval(interval);
            // Add a new mock report to the list and refresh
            const newReport: ReportListItem = {
                report_id: `run-${Date.now()}`,
                timestamp: new Date().toISOString(),
                summary: {
                    total_tests: 10,
                    passed: Math.floor(Math.random() * 3) + 7, // 7 to 9 passes
                    failed: 10 - (Math.floor(Math.random() * 3) + 7)
                }
            };
            setReports(prev => [newReport, ...prev]);
        }
    }, 3000);
  };

  // Mocks API call to fetch details for a specific report
  const handleViewReport = (reportId: string) => {
    setIsModalOpen(true);
    setIsLoadingReportDetails(true);
    console.log(`Fetching details for report: ${reportId}`);
    setTimeout(() => {
        setSelectedReport(mockReportDetails);
        setIsLoadingReportDetails(false);
    }, 1500);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const isRunning = status !== TestStatus.IDLE && status !== TestStatus.COMPLETE && status !== TestStatus.ERROR;

  return (
    <div className="min-h-screen bg-gray-dark font-sans">
      <Header />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8">
            {/* Control Panel */}
            <div className="bg-gray-medium p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-2">Control Panel</h2>
                <p className="text-gray-400 mb-4">Start a new test run to generate test cases and execute them.</p>
                <button
                    onClick={handleStartTestRun}
                    disabled={isRunning}
                    className="flex items-center justify-center px-6 py-3 bg-brand-secondary hover:bg-brand-accent text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:bg-gray-light disabled:cursor-not-allowed"
                >
                    {isRunning ? <ArrowPathIcon className="animate-spin h-5 w-5 mr-3" /> : <PlayIcon className="h-5 w-5 mr-3" />}
                    {isRunning ? `Running... (${status})` : 'Start New Test Run'}
                </button>
            </div>

            {/* Status Section */}
            {isRunning && (
                <div className="bg-gray-medium p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">Current Run Status</h2>
                    <StatusIndicator status={status} />
                </div>
            )}

            {/* Reports Section */}
            <div className="bg-gray-medium p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Available Reports</h2>
                <div className="space-y-3">
                    {isLoadingReports ? (
                        <p className="text-gray-400">Loading reports...</p>
                    ) : reports.length > 0 ? (
                        reports.map(report => (
                            <div key={report.report_id} onClick={() => handleViewReport(report.report_id)} className="group bg-gray-light hover:bg-gray-700 p-4 rounded-lg flex items-center justify-between cursor-pointer transition-colors duration-200">
                                <div className="flex items-center">
                                    <DocumentTextIcon className="h-6 w-6 text-brand-accent mr-4"/>
                                    <div>
                                        <p className="font-semibold text-white">{report.report_id}</p>
                                        <p className="text-sm text-gray-400">{new Date(report.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-status-green">{report.summary.passed} Passed</span>
                                    <span className="text-sm font-medium text-status-red">{report.summary.failed} Failed</span>
                                    <ChevronRightIcon className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors"/>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-4">No reports found. Start a test run to generate one.</p>
                    )}
                </div>
            </div>
        </div>
      </main>
      {isModalOpen && (
          <ReportModal 
            report={selectedReport} 
            isLoading={isLoadingReportDetails} 
            onClose={handleCloseModal} 
          />
      )}
    </div>
  );
};

export default App;
