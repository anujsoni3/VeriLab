import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const TEMP_DIR = path.join(process.cwd(), 'temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

interface CompilationResult {
    success: boolean;
    output: string;
}

export const compileAndRun = async (code: string, testbench: string): Promise<CompilationResult> => {
    const timestamp = Date.now();
    const id = `${timestamp}_${Math.random().toString(36).substring(7)}`;

    const dutPath = path.join(TEMP_DIR, `dut_${id}.v`);
    const tbPath = path.join(TEMP_DIR, `tb_${id}.v`);
    const outPath = path.join(TEMP_DIR, `out_${id}.vvp`);

    try {
        // Write files
        await fs.promises.writeFile(dutPath, code);
        await fs.promises.writeFile(tbPath, testbench);

        // Compile
        // iverilog -o output.vvp testbench.v dut.v
        // Use absolute path since PATH might not be updated
        const iverilogPath = 'C:\\iverilog\\bin\\iverilog.exe';
        const vvpPath = 'C:\\iverilog\\bin\\vvp.exe';

        try {
            await execPromise(`"${iverilogPath}" -o "${outPath}" "${tbPath}" "${dutPath}"`);
        } catch (error: any) {
            return {
                success: false,
                output: `Compilation Error:\n${error.stderr || error.message}`,
            };
        }

        // Simulate
        // vvp output.vvp
        try {
            const { stdout, stderr } = await execPromise(`"${vvpPath}" "${outPath}"`);

            // Cleanup on success
            cleanup(dutPath, tbPath, outPath);

            return {
                success: true, // Verification of actual test logic depends on testbench output parsing, assuming vvp run success = simulation ran.
                // Validating PASS/FAIL logic usually requires checking stdout for specific keywords.
                // For now, if it runs without crashing, we return the output. Controller can parse it or we can add parsing here.
                output: stdout + (stderr ? `\nStderr:\n${stderr}` : ''),
            };

        } catch (error: any) {
            cleanup(dutPath, tbPath, outPath);
            return {
                success: false,
                output: `Runtime Error:\n${error.stderr || error.message}`,
            };
        }

    } catch (error: any) {
        cleanup(dutPath, tbPath, outPath);
        return {
            success: false,
            output: `System Error:\n${error.message}`,
        };
    }
};

const cleanup = async (...paths: string[]) => {
    for (const p of paths) {
        try {
            if (fs.existsSync(p)) {
                await fs.promises.unlink(p);
            }
        } catch (err) {
            console.error(`Failed to delete temp file ${p}:`, err);
        }
    }
};
