import React, { useState, useEffect } from 'react';


interface CombinationalSimulationProps {
    defaultType?: 'half-adder' | 'full-adder' | 'mux-2-1';
}

const CombinationalSimulation: React.FC<CombinationalSimulationProps> = ({ defaultType = 'half-adder' }) => {
    const [selectedCircuit, setSelectedCircuit] = useState<string>(defaultType);
    const [inputs, setInputs] = useState<Record<string, boolean>>({ a: false, b: false, c: false });
    const [outputs, setOutputs] = useState<Record<string, boolean>>({ sum: false, carry: false, y: false });

    useEffect(() => {
        const newOutputs: Record<string, boolean> = {};

        if (selectedCircuit === 'half-adder') {
            newOutputs.sum = inputs.a !== inputs.b; // XOR
            newOutputs.carry = inputs.a && inputs.b; // AND
        } else if (selectedCircuit === 'full-adder') {
            const sumAB = inputs.a !== inputs.b;
            newOutputs.sum = sumAB !== inputs.c; // (A XOR B) XOR Cin
            newOutputs.carry = (inputs.a && inputs.b) || (inputs.c && sumAB); // (A.B) + (Cin.(A XOR B))
        } else if (selectedCircuit === 'mux-2-1') {
            // inputs.c acts as Select line S0
            // inputs.a is D0, inputs.b is D1
            newOutputs.y = inputs.c ? inputs.b : inputs.a;
        }

        setOutputs(newOutputs);
    }, [selectedCircuit, inputs]);

    const handleInputChange = (key: string) => {
        setInputs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const renderCircuitControls = () => {
        switch (selectedCircuit) {
            case 'half-adder':
                return (
                    <>
                        <ToggleSwitch label="A" checked={inputs.a} onChange={() => handleInputChange('a')} />
                        <ToggleSwitch label="B" checked={inputs.b} onChange={() => handleInputChange('b')} />
                    </>
                );
            case 'full-adder':
                return (
                    <>
                        <ToggleSwitch label="A" checked={inputs.a} onChange={() => handleInputChange('a')} />
                        <ToggleSwitch label="B" checked={inputs.b} onChange={() => handleInputChange('b')} />
                        <ToggleSwitch label="Cin" checked={inputs.c} onChange={() => handleInputChange('c')} />
                    </>
                );
            case 'mux-2-1':
                return (
                    <>
                        <ToggleSwitch label="D0" checked={inputs.a} onChange={() => handleInputChange('a')} />
                        <ToggleSwitch label="D1" checked={inputs.b} onChange={() => handleInputChange('b')} />
                        <div className="border-t border-border pt-4 mt-2 w-full">
                            <ToggleSwitch label="Select (S0)" checked={inputs.c} onChange={() => handleInputChange('c')} color="blue" />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const renderOutputs = () => {
        switch (selectedCircuit) {
            case 'half-adder':
            case 'full-adder':
                return (
                    <>
                        <OutputDisplay label="Sum" value={outputs.sum} />
                        <OutputDisplay label="Carry" value={outputs.carry} />
                    </>
                );
            case 'mux-2-1':
                return (
                    <OutputDisplay label="Y" value={outputs.y} />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto p-6">
            <div className="flex justify-center gap-4">
                <CircuitSelectBtn
                    label="Half Adder"
                    isActive={selectedCircuit === 'half-adder'}
                    onClick={() => { setSelectedCircuit('half-adder'); setInputs({ a: false, b: false, c: false }); }}
                />
                <CircuitSelectBtn
                    label="Full Adder"
                    isActive={selectedCircuit === 'full-adder'}
                    onClick={() => { setSelectedCircuit('full-adder'); setInputs({ a: false, b: false, c: false }); }}
                />
                <CircuitSelectBtn
                    label="2:1 MUX"
                    isActive={selectedCircuit === 'mux-2-1'}
                    onClick={() => { setSelectedCircuit('mux-2-1'); setInputs({ a: false, b: false, c: false }); }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-surface border border-border rounded-xl p-8 shadow-sm">

                {/* Inputs Column */}
                <div className="flex flex-col gap-6 items-center md:items-end md:border-r border-border md:pr-8">
                    <h3 className="text-secondary font-semibold uppercase tracking-wider text-xs mb-2">Inputs</h3>
                    {renderCircuitControls()}
                </div>

                {/* Circuit Visual Column */}
                <div className="flex flex-col items-center justify-center p-4">
                    <div className="w-40 h-40 bg-background-subtle rounded-lg border-2 border-primary/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <div className="text-center">
                            <span className="text-4xl text-primary opacity-20"><CircuitIcon type={selectedCircuit} /></span>
                            <div className="text-lg font-bold text-text-primary mt-2 flex flex-col">
                                {selectedCircuit === 'half-adder' && 'Half Adder'}
                                {selectedCircuit === 'full-adder' && 'Full Adder'}
                                {selectedCircuit === 'mux-2-1' && '2:1 MUX'}
                            </div>
                        </div>
                        {/* Decorative connection lines would go here */}
                    </div>
                </div>

                {/* Outputs Column */}
                <div className="flex flex-col gap-6 items-center md:items-start md:border-l border-border md:pl-8">
                    <h3 className="text-secondary font-semibold uppercase tracking-wider text-xs mb-2">Outputs</h3>
                    {renderOutputs()}
                </div>

            </div>
        </div>
    );
};

// Helper Components

const ToggleSwitch = ({ label, checked, onChange, color = 'green' }: { label: string, checked: boolean, onChange: () => void, color?: string }) => (
    <div className="flex items-center gap-3">
        <span className="text-sm font-mono text-text-secondary w-8 text-right">{label}</span>
        <button
            onClick={onChange}
            className={`w-14 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 ${checked ? `bg-${color}-500` : 'bg-gray-700'}`}
        >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${checked ? 'left-8' : 'left-1'}`} />
        </button>
        <span className={`text-xs font-mono w-4 ${checked ? `text-${color}-500` : 'text-gray-500'}`}>
            {checked ? '1' : '0'}
        </span>
    </div>
);

const OutputDisplay = ({ label, value }: { label: string, value: boolean }) => (
    <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${value
            ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
            : 'border-border bg-background-subtle'
            }`}>
            <span className={`text-xl font-bold ${value ? 'text-green-500' : 'text-text-muted'}`}>
                {value ? '1' : '0'}
            </span>
        </div>
        <span className="text-sm font-mono text-text-secondary">{label}</span>
    </div>
);

const CircuitSelectBtn = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-surface hover:bg-background-subtle text-text-secondary border border-border'
            }`}
    >
        {label}
    </button>
);

const CircuitIcon = ({ type }: { type: string }) => {
    // Simple placeholder icons
    if (type.includes('adder')) return <span>+</span>;
    if (type.includes('mux')) return <span>⑁</span>;
    return <span>⚡</span>;
};

export default CombinationalSimulation;
