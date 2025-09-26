import React from 'react';
import { TestStatus } from '../types';
import { CheckCircleIcon, ClockIcon, CogIcon, DocumentMagnifyingGlassIcon, LightBulbIcon, XCircleIcon } from './Icons';

interface StatusIndicatorProps {
  status: TestStatus;
}

const statusConfig = {
    [TestStatus.IDLE]: { text: 'Idle', color: 'status-gray', Icon: ClockIcon },
    [TestStatus.PLANNING]: { text: 'PlannerAgent: Generating test cases...', color: 'status-blue', Icon: LightBulbIcon },
    [TestStatus.RANKING]: { text: 'RankerAgent: Prioritizing test cases...', color: 'status-blue', Icon: DocumentMagnifyingGlassIcon },
    [TestStatus.EXECUTING]: { text: 'ExecutorAgents: Running top 10 tests...', color: 'status-yellow', Icon: CogIcon },
    [TestStatus.ANALYZING]: { text: 'AnalyzerAgent: Validating results...', color: 'status-yellow', Icon: DocumentMagnifyingGlassIcon },
    [TestStatus.COMPLETE]: { text: 'Run Complete', color: 'status-green', Icon: CheckCircleIcon },
    [TestStatus.ERROR]: { text: 'Error Occurred', color: 'status-red', Icon: XCircleIcon },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const { text, color, Icon } = statusConfig[status] || statusConfig[TestStatus.IDLE];

  return (
    <div className={`flex items-center p-4 rounded-lg bg-${color}/10 border border-${color}/30`}>
      <Icon className={`h-8 w-8 text-${color} mr-4`} />
      <div>
        <p className={`text-lg font-semibold text-white`}>
          {status}
        </p>
        <p className={`text-md text-${color}`}>
          {text}
        </p>
      </div>
      <div className="ml-auto w-1/3">
        <div className="w-full bg-gray-light rounded-full h-2.5">
            <div className={`bg-${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: getProgress(status) }}></div>
        </div>
      </div>
    </div>
  );
};

function getProgress(status: TestStatus): string {
    const progressMap: Record<TestStatus, number> = {
        [TestStatus.IDLE]: 0,
        [TestStatus.PLANNING]: 20,
        [TestStatus.RANKING]: 40,
        [TestStatus.EXECUTING]: 60,
        [TestStatus.ANALYZING]: 80,
        [TestStatus.COMPLETE]: 100,
        [TestStatus.ERROR]: 100,
    };
    return `${progressMap[status] || 0}%`;
}
