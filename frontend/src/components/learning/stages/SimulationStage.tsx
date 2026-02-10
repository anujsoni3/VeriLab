import React from 'react';
import { Stage } from '../../../types/learning';
import LogicGateSimulation from '../../learning/simulations/LogicGateSimulation';
import CombinationalSimulation from '../../learning/simulations/CombinationalSimulation';

interface SimulationStageProps {
    stage: Stage;
    onComplete: () => void;
}

const SimulationStage: React.FC<SimulationStageProps> = ({ stage, onComplete }) => {
    const config = stage.simulationConfig;

    if (!config) {
        return <div className="p-4 text-red-500">Invalid simulation configuration.</div>;
    }

    const renderSimulation = () => {
        switch (config.type) {
            case 'logic-gate':
                return <LogicGateSimulation defaultType={config.defaultProps?.defaultType || 'AND'} />;
            case 'combinational':
                return <CombinationalSimulation defaultType={config.defaultProps?.defaultType || 'half-adder'} />;
            default:
                return <div>Unknown simulation type: {config.type}</div>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-text-primary mb-2">{stage.title}</h2>
                <div className="prose prose-invert max-w-none text-text-secondary">
                    {stage.content}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-background p-6">
                {renderSimulation()}
            </div>

            <div className="p-4 border-t border-border bg-surface flex justify-end">
                <button
                    onClick={onComplete}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    Complete Simulation
                </button>
            </div>
        </div>
    );
};

export default SimulationStage;
