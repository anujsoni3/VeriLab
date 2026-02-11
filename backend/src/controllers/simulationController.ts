import { Request, Response } from 'express';
import { compileAndRun } from '../services/compilerService.js';
import Problem from '../models/Problem.js';
import Stage from '../models/Stage.js';

export const simulateCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, problemId, stageId } = req.body;

        if (!code) {
            res.status(400).json({ success: false, error: 'Code is required' });
            return;
        }

        let testbench = '';

        // 1. Try to get testbench from Problem
        if (problemId) {
            const problem = await Problem.findById(problemId);
            if (problem && problem.testbench) {
                testbench = problem.testbench;
            }
        }

        // 2. If not found, try to get from Stage
        if (!testbench && stageId) {
            const stage = await Stage.findById(stageId);
            if (stage && stage.testbench) {
                testbench = stage.testbench;
            }
        }

        // 3. If explicit testbench provided in request (less secure, but useful for testing/custom simulation)
        if (!testbench && req.body.testbench) {
            testbench = req.body.testbench;
        }

        if (!testbench) {
            res.status(400).json({ success: false, error: 'No testbench found for this problem.' });
            return;
        }

        const result = await compileAndRun(code, testbench, true);

        res.json({
            success: true,
            data: {
                status: result.success ? 'success' : 'error',
                output: result.output,
                vcd: result.vcd
            },
        });
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ success: false, error: 'Server error during simulation' });
    }
};
