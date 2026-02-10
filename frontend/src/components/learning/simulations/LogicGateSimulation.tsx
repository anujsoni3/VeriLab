import React, { useState, useEffect } from 'react';


interface LogicGateSimulationProps {
    defaultType?: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
}

const GATES = {
    AND: (a: boolean, b: boolean) => a && b,
    OR: (a: boolean, b: boolean) => a || b,
    NOT: (a: boolean) => !a,
    NAND: (a: boolean, b: boolean) => !(a && b),
    NOR: (a: boolean, b: boolean) => !(a || b),
    XOR: (a: boolean, b: boolean) => a !== b,
    XNOR: (a: boolean, b: boolean) => a === b,
};

const LogicGateSimulation: React.FC<LogicGateSimulationProps> = ({ defaultType = 'AND' }) => {
    const [selectedGate, setSelectedGate] = useState<keyof typeof GATES>(defaultType);
    const [inputA, setInputA] = useState(false);
    const [inputB, setInputB] = useState(false);
    const [output, setOutput] = useState(false);

    useEffect(() => {
        if (selectedGate === 'NOT') {
            setOutput(GATES['NOT'](inputA));
        } else {
            // @ts-ignore
            setOutput(GATES[selectedGate](inputA, inputB));
        }
    }, [selectedGate, inputA, inputB]);

    const TruthTable = () => {
        const combinations = selectedGate === 'NOT' ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];

        return (
            <div className="mt-6 bg-background-subtle rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-text-primary mb-3">Truth Table: {selectedGate}</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-3 py-2 text-left text-text-secondary">A</th>
                                {selectedGate !== 'NOT' && <th className="px-3 py-2 text-left text-text-secondary">B</th>}
                                <th className="px-3 py-2 text-left text-text-secondary">Output</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinations.map((inputs, idx) => {
                                const res = selectedGate === 'NOT'
                                    ? GATES['NOT'](!!inputs[0])
                                    : // @ts-ignore
                                    GATES[selectedGate](!!inputs[0], !!inputs[1]);

                                const isCurrent = selectedGate === 'NOT'
                                    ? inputs[0] === (inputA ? 1 : 0)
                                    : inputs[0] === (inputA ? 1 : 0) && inputs[1] === (inputB ? 1 : 0);

                                return (
                                    <tr key={idx} className={`border-b border-border/50 ${isCurrent ? 'bg-primary/10' : ''}`}>
                                        <td className="px-3 py-2 text-text-primary">{inputs[0]}</td>
                                        {selectedGate !== 'NOT' && <td className="px-3 py-2 text-text-primary">{inputs[1]}</td>}
                                        <td className={`px-3 py-2 font-mono font-bold ${res ? 'text-green-500' : 'text-text-muted'}`}>
                                            {res ? 1 : 0}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col space-y-6 max-w-2xl mx-auto p-4">
            <div className="flex justify-center space-x-2 flex-wrap gap-2">
                {Object.keys(GATES).map((gate) => (
                    <button
                        key={gate}
                        onClick={() => setSelectedGate(gate as keyof typeof GATES)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedGate === gate
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface hover:bg-background-subtle text-text-secondary'
                            }`}
                    >
                        {gate}
                    </button>
                ))}
            </div>

            <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center shadow-sm relative overflow-hidden">
                {/* Visual Wiring Representation */}
                <div className="flex items-center space-x-8 z-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-text-secondary">A</span>
                            <button
                                onClick={() => setInputA(!inputA)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${inputA ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${inputA ? 'left-7' : 'left-1'}`} />
                            </button>
                            <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${inputA ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
                                {inputA ? '1' : '0'}
                            </span>
                        </div>
                        {selectedGate !== 'NOT' && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-text-secondary">B</span>
                                <button
                                    onClick={() => setInputB(!inputB)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${inputB ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${inputB ? 'left-7' : 'left-1'}`} />
                                </button>
                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${inputB ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
                                    {inputB ? '1' : '0'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Gate Visualization (Simple SVG) */}
                    <div className="w-32 h-32 bg-background-subtle rounded-lg border border-border flex items-center justify-center relative">
                        {/* Simple visual placeholders for gates - in a real app these would be proper SVGs */}
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${output ? 'text-primary' : 'text-text-muted'}`}>
                                {selectedGate}
                            </div>
                            {/* Mock wires */}
                            <div className="absolute left-0 top-1/3 w-4 h-0.5 bg-gray-600"></div>
                            {selectedGate !== 'NOT' && <div className="absolute left-0 top-2/3 w-4 h-0.5 bg-gray-600"></div>}
                            <div className="absolute right-0 top-1/2 w-4 h-0.5 bg-gray-600"></div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-mono text-text-secondary">OUT</span>
                        <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${output
                            ? 'border-green-500 bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                            : 'border-gray-700 bg-gray-800'
                            }`}>
                            <span className={`text-xl font-bold ${output ? 'text-green-500' : 'text-gray-500'}`}>
                                {output ? '1' : '0'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
                </div>
            </div>

            <TruthTable />
        </div>
    );
};

export default LogicGateSimulation;
