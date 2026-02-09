import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Stage } from '../../../types/learning';
import { Play, RotateCcw, Check, Sparkles } from 'lucide-react';

interface PracticeStageProps {
    stage: Stage;
}

const PracticeStage: React.FC<PracticeStageProps> = ({ stage }) => {
    const [code, setCode] = useState(stage.codeSnippet || '// Write your code here');
    const [output, setOutput] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        setOutput(null);
        setIsSuccess(false);

        // Mock execution simulation
        setTimeout(() => {
            setIsRunning(false);
            setOutput('Compilation successful.\nSimulation started...\n\nResult: 4-bit Counter output: 0000 -> 0001 -> 0010...\n\nTestbench: PASS');
            setIsSuccess(true);
        }, 1500);
    };

    const handleReset = () => {
        setCode(stage.codeSnippet || '');
        setOutput(null);
        setIsSuccess(false);
    };

    return (
        <div className="h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-6">
            {/* Left Panel: Instructions */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">{stage.title}</h2>
                    <p className="text-text-secondary leading-relaxed">
                        This is a practice stage. Write the Verilog/C code to solve the challenge described below.
                    </p>
                </div>

                <div className="bg-surface border border-border rounded-xl p-4">
                    <h3 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-500" />
                        Task
                    </h3>
                    <p className="text-sm text-text-secondary">
                        Implement a 4-bit counter module that increments on every positive edge of the clock.
                        Reset to 0 when reset signal is high.
                    </p>
                </div>

                {/* Expected Output or Criteria */}
                <div className="bg-surface border border-border rounded-xl p-4">
                    <h3 className="font-semibold text-text-primary mb-2">IO Specs</h3>
                    <ul className="text-sm text-text-secondary space-y-1 font-mono">
                        <li>input clk</li>
                        <li>input rst</li>
                        <li>output [3:0] count</li>
                    </ul>
                </div>
            </div>

            {/* Right Panel: Code Editor */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4 h-full">
                <div className="flex-grow border border-border rounded-xl overflow-hidden shadow-2xl relative flex flex-col">
                    {/* Editor Header */}
                    <div className="bg-[#1e1e1e] border-b border-white/10 p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5 px-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <span className="text-xs text-gray-400 font-mono ml-2">solution.v</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReset}
                                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded hover:bg-white/10" title="Reset Code"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow">
                        <Editor
                            height="100%"
                            defaultLanguage="verilog"
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'Fira Code', monospace",
                                scrollBeyondLastLine: false,
                                padding: { top: 16 }
                            }}
                        />
                    </div>
                </div>

                {/* Output Console & Actions */}
                <div className={`
             transition-all duration-300 rounded-xl border border-border p-4
             ${isSuccess ? 'bg-green-500/5 border-green-500/20' : 'bg-surface'}
             ${output ? 'h-48' : 'h-16 flex items-center justify-end'}
        `}>
                    {!output ? (
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="flex items-center gap-2 px-6 py-2 bg-success hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-500/20"
                        >
                            {isRunning ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play size={16} />
                                    Run Code
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold text-text-secondary uppercase">Console Output</span>
                                {isSuccess && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-500 px-2 py-0.5 bg-green-500/10 rounded-full">
                                        <Check size={12} /> Passed
                                    </span>
                                )}
                            </div>
                            <pre className="flex-grow overflow-y-auto font-mono text-xs md:text-sm text-gray-300 whitespace-pre-wrap">
                                {output}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticeStage;
