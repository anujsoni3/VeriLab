import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import Stage from '../models/Stage.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const fixTestbenches = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // 1. Fix 4-bit ALU
        const alu = await Problem.findOne({ title: { $regex: /ALU/i } });
        if (alu) {
            console.log(`Found ALU problem: ${alu.title}`);
            alu.testbench = `
module tb_alu;
    reg [3:0] a, b;
    reg [1:0] op;
    wire [3:0] result;

    alu_4bit uut (
        .a(a),
        .b(b),
        .op(op),
        .result(result)
    );

    initial begin
        $dumpfile("alu.vcd");
        $dumpvars(0, tb_alu);
        $monitor("Time=%0t a=%h b=%h op=%b result=%h", $time, a, b, op, result);
        
        // Test Cases
        a = 4'hf; b = 4'h1; op = 2'b00; #10; // ADD: f+1 = 0
        if (result !== 4'h0) $display("FAIL: ADD 15+1");

        a = 4'h5; b = 4'h3; op = 2'b00; #10; // ADD: 5+3 = 8
        if (result !== 4'h8) $display("FAIL: ADD 5+3");

        a = 4'h8; b = 4'h3; op = 2'b01; #10; // SUB: 8-3 = 5
        if (result !== 4'h5) $display("FAIL: SUB 8-3");

        a = 4'hC; b = 4'hA; op = 2'b10; #10; // AND: 1100 & 1010 = 1000 (8)
        if (result !== 4'h8) $display("FAIL: AND C&A");

        a = 4'hC; b = 4'hA; op = 2'b11; #10; // OR: 1100 | 1010 = 1110 (E)
        if (result !== 4'hE) $display("FAIL: OR C|A");

        $finish;
    end
endmodule
`;
            await alu.save();
            console.log('Updated ALU testbench');
        } else {
            console.log('ALU Problem not found. Creating it...');
            // Optional: Create if missing, but better to just log
            await Problem.create({
                title: '4-bit ALU',
                slug: '4-bit-alu',
                description: 'Design a 4-bit Arithmetic Logic Unit supporting ADD, SUB, AND, OR operations.\n\n### Specifications\n**Inputs**: `a[3:0]`, `b[3:0]`, `op[1:0]`\n**Output**: `result[3:0]`\n\n**Operations**:\n- `op = 00`: ADD\n- `op = 01`: SUB\n- `op = 10`: AND\n- `op = 11`: OR',
                difficulty: 'hard',
                category: 'Arithmetic Circuits',
                tags: ['combinational', 'arithmetic', 'alu'],
                points: 40,
                templateCode: `module alu_4bit(
    input [3:0] a,
    input [3:0] b,
    input [1:0] op,
    output reg [3:0] result
);

    // Your code here

endmodule`,
                testbench: `
module tb_alu;
    reg [3:0] a, b;
    reg [1:0] op;
    wire [3:0] result;

    alu_4bit uut (
        .a(a),
        .b(b),
        .op(op),
        .result(result)
    );

    initial begin
        $dumpfile("alu.vcd");
        $dumpvars(0, tb_alu);
        $monitor("Time=%0t a=%h b=%h op=%b result=%h", $time, a, b, op, result);
        
        // Test Cases
        a = 4'hf; b = 4'h1; op = 2'b00; #10; // ADD: f+1 = 0
        if (result !== 4'h0) $display("FAIL: ADD 15+1");

        a = 4'h5; b = 4'h3; op = 2'b00; #10; // ADD: 5+3 = 8
        if (result !== 4'h8) $display("FAIL: ADD 5+3");

        a = 4'h8; b = 4'h3; op = 2'b01; #10; // SUB: 8-3 = 5
        if (result !== 4'h5) $display("FAIL: SUB 8-3");

        a = 4'hC; b = 4'hA; op = 2'b10; #10; // AND: 1100 & 1010 = 1000 (8)
        if (result !== 4'h8) $display("FAIL: AND C&A");

        a = 4'hC; b = 4'hA; op = 2'b11; #10; // OR: 1100 | 1010 = 1110 (E)
        if (result !== 4'hE) $display("FAIL: OR C|A");

        $finish;
    end
endmodule
`
            });
            console.log('Created 4-bit ALU problem');
        }

        // 2. Fix Majority Circuit (Problem Type)
        const majorityStage = await Stage.findOne({ title: 'Design a Majority Circuit' });
        if (majorityStage) {
            console.log('Found Majority Circuit Stage');
            if (!majorityStage.problemId) {
                // Check if Problem exists
                let majProb = await Problem.findOne({ title: 'Majority Circuit' });
                if (!majProb) {
                    majProb = await Problem.create({
                        title: 'Majority Circuit',
                        slug: 'majority-circuit',
                        description: 'Design a circuit that outputs 1 if the majority of 3 inputs (A, B, C) are 1.',
                        difficulty: 'medium',
                        category: 'Combinational Logic',
                        points: 20,
                        templateCode: `module majority(input a, b, c, output y);\n\nendmodule`,
                        testbench: `
module tb_majority;
    reg a, b, c;
    wire y;
    
    majority uut (a, b, c, y);
    
    initial begin
        $dumpfile("majority.vcd");
        $dumpvars(0, tb_majority);
        
        // 000 -> 0
        a=0; b=0; c=0; #10;
        if (y !== 0) $display("Fail 000");
        
        // 001 -> 0
        a=0; b=0; c=1; #10;
        if (y !== 0) $display("Fail 001");
        
        // 011 -> 1
        a=0; b=1; c=1; #10;
        if (y !== 1) $display("Fail 011");
        
        // 111 -> 1
        a=1; b=1; c=1; #10;
        if (y !== 1) $display("Fail 111");
        
        $finish;
    end
endmodule
`
                    });
                    console.log('Created Majority Circuit Problem');
                }
                majorityStage.problemId = majProb._id as any;
                await majorityStage.save();
                console.log('Linked Problem to Majority Circuit Stage');
            }
        }

        // 3. Fix Practice Stages (Full Adder, Counter)
        const fullAdderStage = await Stage.findOne({ title: { $regex: /Full Adder/i } });
        if (fullAdderStage) {
            console.log('Found Full Adder Stage');
            fullAdderStage.testbench = `
module tb_full_adder;
    reg a, b, cin;
    wire sum, cout;
    
    full_adder uut (a, b, cin, sum, cout);
    
    initial begin
        $dumpfile("full_adder.vcd");
        $dumpvars(0, tb_full_adder);
        
        // 0+0+0 = 00
        a=0; b=0; cin=0; #10;
        
        // 0+1+0 = 01
        a=0; b=1; cin=0; #10;
        
        // 1+1+0 = 10
        a=1; b=1; cin=0; #10;
        
        // 1+1+1 = 11
        a=1; b=1; cin=1; #10;
        
        $finish;
    end
endmodule
`;
            await fullAdderStage.save();
            console.log('Updated Full Adder Stage testbench');
        }

        const counterStage = await Stage.findOne({ title: { $regex: /Counter/i } });
        if (counterStage) {
            console.log('Found Counter Stage');
            counterStage.testbench = `
module tb_counter;
    reg clk, rst;
    wire [3:0] count;
    
    counter uut (clk, rst, count);
    
    initial begin
        clk = 0;
        forever #5 clk = ~clk;
    end
    
    initial begin
        $dumpfile("counter.vcd");
        $dumpvars(0, tb_counter);
        
        rst = 1;
        #15;
        rst = 0;
        #200;
        $finish;
    end
endmodule
`;
            await counterStage.save();
            console.log('Updated Counter Stage testbench');
        }

        console.log('Fix script completed');
        process.exit(0);
    } catch (error) {
        console.error('Fix script failed:', error);
        process.exit(1);
    }
};

fixTestbenches();
