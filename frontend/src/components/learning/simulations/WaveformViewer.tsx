import React, { useEffect, useRef, useState } from 'react';

interface WaveformViewerProps {
    vcdData: string;
}

interface Signal {
    name: string;
    type: string;
    size: number;
    id: string; // The specific code in VCD
    values: { time: number; value: string }[];
}

const WaveformViewer: React.FC<WaveformViewerProps> = ({ vcdData }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [signals, setSignals] = useState<Signal[]>([]);
    const [endTime, setEndTime] = useState(0);
    const [scale, setScale] = useState(50); // pixels per time unit

    useEffect(() => {
        if (!vcdData) return;

        const parsedSignals = parseVCD(vcdData);
        setSignals(parsedSignals.signals);
        setEndTime(parsedSignals.endTime);
    }, [vcdData]);

    useEffect(() => {
        drawWaveforms();
    }, [signals, scale, endTime]);

    const parseVCD = (data: string) => {
        const lines = data.split(/\r?\n/);
        const signalsMap = new Map<string, Signal>();
        const signalsList: Signal[] = [];
        let currentTime = 0;
        let maxTime = 0;

        // 1. Header Parsing
        let inDef = true;

        for (const line of lines) {
            const l = line.trim();
            if (!l) continue;

            if (l.startsWith('$enddefinitions')) {
                inDef = false;
                continue;
            }

            if (inDef) {
                if (l.startsWith('$var')) {
                    // $var type size code name $end
                    const parts = l.split(/\s+/);
                    if (parts.length >= 5) {
                        const type = parts[1];
                        const size = parseInt(parts[2]);
                        const code = parts[3];
                        const name = parts[4];

                        // Ignore some internal vars if needed, or filter
                        const sig: Signal = {
                            name,
                            type,
                            size,
                            id: code,
                            values: [{ time: 0, value: 'x' }] // Initial value
                        };
                        signalsMap.set(code, sig);
                        signalsList.push(sig);
                    }
                }
            } else {
                // 2. Data Parsing
                if (l.startsWith('#')) {
                    currentTime = parseInt(l.substring(1));
                    maxTime = Math.max(maxTime, currentTime);
                } else if (!l.startsWith('$')) {
                    // Value change: "1#" or "0#" or "b101 #"
                    // Binary vector: b<val> <code>
                    // Scalar: <val><code>

                    if (l.startsWith('b')) {
                        const parts = l.split(/\s+/);
                        if (parts.length === 2) {
                            const val = parts[0].substring(1);
                            const code = parts[1];
                            const sig = signalsMap.get(code);
                            if (sig) {
                                sig.values.push({ time: currentTime, value: val });
                            }
                        }
                    } else {
                        // Scalar
                        // regex match: value then code
                        // Value can be 0, 1, x, z
                        const match = l.match(/^([01xz])(.+)$/);
                        if (match) {
                            const val = match[1];
                            const code = match[2];
                            const sig = signalsMap.get(code);
                            if (sig) {
                                sig.values.push({ time: currentTime, value: val });
                            }
                        }
                    }
                }
            }
        }

        // Fill in last value to maxTime for all signals
        signalsList.forEach(sig => {
            if (sig.values.length > 0) {
                const lastVal = sig.values[sig.values.length - 1];
                if (lastVal.time < maxTime) {
                    sig.values.push({ time: maxTime, value: lastVal.value });
                }
            }
        });

        return { signals: signalsList, endTime: maxTime };
    };

    const drawWaveforms = () => {
        const canvas = canvasRef.current;
        if (!canvas || signals.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const ROW_HEIGHT = 60;
        const LABEL_WIDTH = 100;
        const PADDING_TOP = 20;

        // Resize canvas
        const width = Math.max(containerRef.current?.clientWidth || 800, LABEL_WIDTH + endTime * scale + 50);
        const height = PADDING_TOP + signals.length * ROW_HEIGHT + 30; // +30 for timescale

        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        // Clear
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, width, height);

        // Draw Time Grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.font = '10px monospace';
        ctx.fillStyle = '#666';

        for (let t = 0; t <= endTime; t += 10) { // Step depends on logic
            const x = LABEL_WIDTH + t * scale;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            ctx.fillText(t.toString(), x + 2, height - 10);
        }

        // Draw Signals
        signals.forEach((sig, index) => {
            const yBase = PADDING_TOP + index * ROW_HEIGHT + ROW_HEIGHT / 2;
            const yHigh = yBase - 15;
            const yLow = yBase + 15;

            // Draw Label
            ctx.fillStyle = '#ccc';
            ctx.font = '12px monospace';
            ctx.fillText(sig.name, 10, yBase);
            ctx.beginPath();
            ctx.moveTo(0, yBase + 30);
            ctx.lineTo(width, yBase + 30);
            ctx.strokeStyle = '#333';
            ctx.stroke();

            // Draw Waveform
            ctx.strokeStyle = '#4ade80'; // Green-400
            ctx.lineWidth = 2;
            ctx.beginPath();

            let lastX = LABEL_WIDTH;
            let lastVal = sig.values[0]?.value || 'x';

            // Initial Move
            const getLeven = (val: string) => {
                if (val === '1') return yHigh;
                if (val === '0') return yLow;
                return yBase; // x or z
            };

            ctx.moveTo(lastX, getLeven(lastVal));

            // Iterate through changes
            // Note: sig.values are just changes. We need to draw horizontal line until next change.
            for (let i = 0; i < sig.values.length; i++) {
                const entry = sig.values[i];
                const x = LABEL_WIDTH + entry.time * scale;
                const level = getLeven(entry.value);
                const prevLevel = getLeven(lastVal);

                // Draw horizontal from lastX to x at prevLevel
                ctx.lineTo(x, prevLevel);

                // Draw vertical to new level
                ctx.lineTo(x, level);

                // Update
                lastX = x;
                lastVal = entry.value;

                // Draw Logic Value Text if space permits and it's a bus or x/z
                if (sig.size > 1 || entry.value === 'x' || entry.value === 'z') {
                    ctx.fillStyle = '#fff';
                    ctx.font = '10px monospace';
                    ctx.fillText(entry.value, x + 2, level - 2);
                }
            }

            // Draw to end
            const endX = LABEL_WIDTH + endTime * scale;
            ctx.lineTo(endX, getLeven(lastVal));

            ctx.stroke();
        });
    };

    return (
        <div ref={containerRef} className="overflow-x-auto bg-[#1e1e1e] rounded-lg border border-border">
            <div className="flex justify-between items-center p-2 border-b border-white/10">
                <h3 className="text-xs font-semibold text-gray-400">WAVEFORM VIEWER</h3>
                <div className="flex gap-2">
                    <button onClick={() => setScale(s => Math.max(10, s - 10))} className="px-2 py-1 bg-white/5 rounded text-xs">- Zoom</button>
                    <button onClick={() => setScale(s => Math.min(200, s + 10))} className="px-2 py-1 bg-white/5 rounded text-xs">+ Zoom</button>
                </div>
            </div>
            <canvas ref={canvasRef} className="block" />
        </div>
    );
};

export default WaveformViewer;
