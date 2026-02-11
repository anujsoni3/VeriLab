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
    vcd?: string;
}

export const compileAndRun = async (code: string, testbench: string, generateVCD: boolean = false): Promise<CompilationResult> => {
    const timestamp = Date.now();
    const id = `${timestamp}_${Math.random().toString(36).substring(7)}`;

    const dutPath = path.join(TEMP_DIR, `dut_${id}.v`);
    const tbPath = path.join(TEMP_DIR, `tb_${id}.v`);
    const outPath = path.join(TEMP_DIR, `out_${id}.vvp`);
    const vcdPath = path.join(TEMP_DIR, `wave_${id}.vcd`);

    try {
        let finalTestbench = testbench;
        if (generateVCD) {
            // Inject VCD dump commands if requested and not present
            // We'll try to insert before the last 'endmodule'
            if (!finalTestbench.includes('$dumpfile')) {
                const dumpCommands = `
    initial begin
        $dumpfile("${vcdPath.replace(/\\/g, '/')}");
        $dumpvars(0);
    end
`;
                const lastEndModuleIndex = finalTestbench.lastIndexOf('endmodule');
                if (lastEndModuleIndex !== -1) {
                    finalTestbench = finalTestbench.slice(0, lastEndModuleIndex) + dumpCommands + finalTestbench.slice(lastEndModuleIndex);
                } else {
                    // Fallback: append to end (might fail if not inside a module, but best effort)
                    finalTestbench += dumpCommands;
                }
            }
        }

        // Write files
        await fs.promises.writeFile(dutPath, code);

        // Check if testbench has hardcoded $dumpfile
        const dumpFileMatch = finalTestbench.match(/\$dumpfile\s*\(\s*["']([^"']+)["']\s*\)/);
        let hardcodedVcdPath: string | null = null;
        if (dumpFileMatch) {
            // If user/testbench provided a specific filename, we need to respect that during simulation,
            // but then rename it to our expected vcdPath for reading.
            // However, iverilog runs in CWD (which is backend root probably), so we need to be careful.
            // Best approach: If we injected the commands, we used vcdPath.
            // If it was already there (like in alu.testbench), it's "alu.vcd".
            // We should let it run, and then check if that file exists if vcdPath doesn't.
            hardcodedVcdPath = path.join(path.dirname(vcdPath), dumpFileMatch[1]);
            // But wait, the simulation runs in CWD. If we execute `vvp out.vvp`, where does it drop the vcd?
            // It drops it in CWD unless an absolute path is provided.
            // Our injected command uses absolute path `vcdPath`.
            // The "alu.vcd" from fixTestbenches is relative.
            if (!path.isAbsolute(dumpFileMatch[1])) {
                hardcodedVcdPath = path.join(process.cwd(), dumpFileMatch[1]);
            } else {
                hardcodedVcdPath = dumpFileMatch[1];
            }
        }

        await fs.promises.writeFile(tbPath, finalTestbench);

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

            let vcdContent: string | undefined;
            if (generateVCD) {
                if (fs.existsSync(vcdPath)) {
                    vcdContent = await fs.promises.readFile(vcdPath, 'utf8');
                } else if (hardcodedVcdPath && fs.existsSync(hardcodedVcdPath)) {
                    vcdContent = await fs.promises.readFile(hardcodedVcdPath, 'utf8');
                    // It's a file created in CWD (likely), so we should clean it up too
                    try { await fs.promises.unlink(hardcodedVcdPath); } catch { }
                }
            }

            // Cleanup on success
            cleanup(dutPath, tbPath, outPath, vcdPath);

            return {
                success: true,
                output: stdout + (stderr ? `\nStderr:\n${stderr}` : ''),
                vcd: vcdContent
            };

        } catch (error: any) {
            cleanup(dutPath, tbPath, outPath, vcdPath);
            return {
                success: false,
                output: `Runtime Error:\n${error.stderr || error.message}`,
            };
        }

    } catch (error: any) {
        // cleanup(dutPath, tbPath, outPath, vcdPath); // Cleanup handled in finally or specific catch blocks?
        // Better to try cleanup anyway
        try { await cleanup(dutPath, tbPath, outPath, vcdPath); } catch { }

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
