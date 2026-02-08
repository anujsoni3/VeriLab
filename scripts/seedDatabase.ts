import mongoose, { Schema } from 'mongoose';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config({ path: '../backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ece-platform';

// Define models inline to avoid Mongoose instance conflicts
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true },
    avatar: { type: String, default: null },
    college: { type: String, required: true },
    branch: { type: String, required: true },
    solvedProblems: { type: [String], default: [] },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
}, { timestamps: true });

const ProblemSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    points: { type: Number, required: true },
    templateCode: { type: String, required: true },
    testbench: { type: String, required: true }, // Added testbench
}, { timestamps: true });

const QuizSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    duration: { type: Number, required: true },
    questions: [{
        id: { type: String, required: true },
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswers: { type: [Number], required: true },
        explanation: { type: String, required: true },
        points: { type: Number, required: true },
    }],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Problem = mongoose.model('Problem', ProblemSchema);
const Quiz = mongoose.model('Quiz', QuizSchema);

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        console.log(`📡 Connecting to: ${MONGODB_URI}`);

        // Connect to MongoDB with proper options
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000,
        });

        console.log('✅ Connected to MongoDB');

        // Wait for connection to be ready
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB connection not ready');
        }

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Problem.deleteMany({}),
            Quiz.deleteMany({}),
        ]);

        console.log('🗑️  Cleared existing data');

        // Seed Problems
        console.log('\n📝 Seeding problems...');

        const problems = [
            {
                title: 'Design a 2-to-1 Multiplexer',
                slug: '2-to-1-mux',
                description: `# 2-to-1 Multiplexer

Design a 2-to-1 multiplexer in Verilog.

## Specifications
- **Inputs**: \`a\`, \`b\` (data inputs), \`sel\` (select line)
- **Output**: \`y\`
- **Behavior**: When \`sel = 0\`, output \`a\`. When \`sel = 1\`, output \`b\`.

## Example
\`\`\`
sel = 0, a = 1, b = 0 → y = 1
sel = 1, a = 1, b = 0 → y = 0
\`\`\``,
                difficulty: 'easy' as const,
                category: 'Combinational Logic',
                tags: ['multiplexer', 'combinational', 'basics'],
                points: 10,
                templateCode: `module mux_2to1(
  input a,
  input b,
  input sel,
  output y
);

  // Your code here

endmodule`,
                testbench: `module tb_mux_2to1;
  reg a, b, sel;
  wire y;
  
  mux_2to1 uut (
    .a(a), .b(b), .sel(sel), .y(y)
  );
  
  initial begin
    $display("Starting Testbench...");
    
    // Case 1: sel=0, expect y=a
    a = 0; b = 1; sel = 0; #10;
    if (y !== 0) begin $display("FAIL: sel=0, a=0, b=1 -> y=%b (expected 0)", y); $finish; end
    
    a = 1; b = 0; sel = 0; #10;
    if (y !== 1) begin $display("FAIL: sel=0, a=1, b=0 -> y=%b (expected 1)", y); $finish; end
    
    // Case 2: sel=1, expect y=b
    a = 0; b = 1; sel = 1; #10;
    if (y !== 1) begin $display("FAIL: sel=1, a=0, b=1 -> y=%b (expected 1)", y); $finish; end
    
    a = 1; b = 0; sel = 1; #10;
    if (y !== 0) begin $display("FAIL: sel=1, a=1, b=0 -> y=%b (expected 0)", y); $finish; end
    
    $display("PASS: All tests passed.");
    $finish;
  end
endmodule`,
            },
            {
                title: 'Implement a Half Adder',
                slug: 'half-adder',
                description: `# Half Adder

Implement a half adder circuit in Verilog.

## Specifications
- **Inputs**: \`a\`, \`b\`
- **Outputs**: \`sum\`, \`carry\`
- **Logic**: 
  - \`sum = a XOR b\`
  - \`carry = a AND b\``,
                difficulty: 'easy' as const,
                category: 'Arithmetic Circuits',
                tags: ['adder', 'arithmetic', 'combinational'],
                points: 10,
                templateCode: `module half_adder(
  input a,
  input b,
  output sum,
  output carry
);

  // Your code here

endmodule`,
                testbench: `module tb_half_adder;
  reg a, b;
  wire sum, carry;
  
  half_adder uut (
    .a(a), .b(b), .sum(sum), .carry(carry)
  );
  
  initial begin
    $display("Testbench started");
    
    a=0; b=0; #10;
    if(sum !== 0 || carry !== 0) begin $display("FAIL: 0+0 -> s=%b c=%b", sum, carry); $finish; end
    
    a=0; b=1; #10;
    if(sum !== 1 || carry !== 0) begin $display("FAIL: 0+1 -> s=%b c=%b", sum, carry); $finish; end
    
    a=1; b=0; #10;
    if(sum !== 1 || carry !== 0) begin $display("FAIL: 1+0 -> s=%b c=%b", sum, carry); $finish; end
    
    a=1; b=1; #10;
    if(sum !== 0 || carry !== 1) begin $display("FAIL: 1+1 -> s=%b c=%b", sum, carry); $finish; end
    
    $display("PASS");
    $finish;
  end
endmodule`,
            },
            {
                title: 'Design a D Flip-Flop',
                slug: 'd-flip-flop',
                description: `# D Flip-Flop

Design a positive edge-triggered D flip-flop.

## Specifications
- **Inputs**: \`d\`, \`clk\`, \`reset\`
- **Output**: \`q\`
- **Behavior**: On positive edge of clock, \`q\` takes value of \`d\`. Asynchronous active-high reset.`,
                difficulty: 'easy' as const,
                category: 'Sequential Logic',
                tags: ['flip-flop', 'sequential', 'storage'],
                points: 15,
                templateCode: `module d_flip_flop(
  input d,
  input clk,
  input reset,
  output reg q
);

  // Your code here

endmodule`,
                testbench: `module tb_dff;
  reg d, clk, reset;
  wire q;
  
  d_flip_flop uut (
    .d(d), .clk(clk), .reset(reset), .q(q)
  );
  
  initial begin
    clk = 0;
    forever #5 clk = ~clk;
  end
  
  initial begin
    reset = 1; d = 0;
    #15;
    reset = 0;
    
    // Test D=1
    d = 1;
    #10; // Wait for clock edge
    if (q !== 1) begin $display("FAIL: q should be 1"); $finish; end
    
    // Test D=0
    d = 0;
    #10;
    if (q !== 0) begin $display("FAIL: q should be 0"); $finish; end
    
    // Test Reset
    d = 1;
    #10;
    reset = 1;
    #2; // Async reset check
    if (q !== 0) begin $display("FAIL: q should be 0 after reset"); $finish; end
    
    $display("PASS");
    $finish;
  end
endmodule`,
            },
            {
                title: 'Build a 4-bit Ripple Carry Adder',
                slug: '4-bit-adder',
                description: `# 4-bit Ripple Carry Adder

Create a 4-bit ripple carry adder using full adders.

## Specifications
- **Inputs**: \`a[3:0]\`, \`b[3:0]\`, \`cin\`
- **Outputs**: \`sum[3:0]\`, \`cout\`
- **Hint**: Chain 4 full adders together`,
                difficulty: 'medium' as const,
                category: 'Arithmetic Circuits',
                tags: ['adder', 'arithmetic', 'multi-bit'],
                points: 20,
                templateCode: `module ripple_carry_adder_4bit(
  input [3:0] a,
  input [3:0] b,
  input cin,
  output [3:0] sum,
  output cout
);

  // Your code here

endmodule`,
                testbench: `module tb_rca;
  reg [3:0] a, b;
  reg cin;
  wire [3:0] sum;
  wire cout;
  
  ripple_carry_adder_4bit uut (
    .a(a), .b(b), .cin(cin), .sum(sum), .cout(cout)
  );
  
  initial begin
    a = 4'd3; b = 4'd5; cin = 0; #10;
    if ({cout, sum} !== 8) begin $display("FAIL: 3+5+0 != 8"); $finish; end
    
    a = 4'd15; b = 4'd1; cin = 0; #10;
    if ({cout, sum} !== 16) begin $display("FAIL: 15+1+0 != 16"); $finish; end
    
    $display("PASS");
    $finish;
  end
endmodule`,
            },
            {
                title: 'Design a 3-bit Up Counter',
                slug: '3-bit-counter',
                description: `# 3-bit Up Counter

Design a 3-bit synchronous up counter with reset.

## Specifications
- **Inputs**: \`clk\`, \`reset\`
- **Output**: \`count[2:0]\`
- **Behavior**: Counts from 0 to 7, then wraps to 0. Synchronous active-high reset.`,
                difficulty: 'medium' as const,
                category: 'Sequential Logic',
                tags: ['counter', 'sequential', 'state-machine'],
                points: 25,
                templateCode: `module counter_3bit(
  input clk,
  input reset,
  output reg [2:0] count
);

  // Your code here

endmodule`,
                testbench: `module tb_counter;
  reg clk, reset;
  wire [2:0] count;
  
  counter_3bit uut (.clk(clk), .reset(reset), .count(count));
  
  initial clk = 0;
  always #5 clk = ~clk;
  
  initial begin
    reset = 1; #15;
    if (count !== 0) begin $display("FAIL: Reset failed"); $finish; end
    reset = 0;
    
    #10; if (count !== 1) begin $display("FAIL: Count 1"); $finish; end
    #10; if (count !== 2) begin $display("FAIL: Count 2"); $finish; end
    #50; if (count !== 7) begin $display("FAIL: Count 7"); $finish; end
    #10; if (count !== 0) begin $display("FAIL: Wrap around"); $finish; end
    
    $display("PASS");
    $finish;
  end
endmodule`,
            },
            {
                title: 'Sequence Detector (1011)',
                slug: 'sequence-detector',
                description: `# Sequence Detector

Design a Moore FSM to detect the sequence "1011" in a serial input stream.

## Specifications
- **Inputs**: \`data_in\`, \`clk\`, \`reset\`
- **Output**: \`detected\`
- **Behavior**: Output goes high for one clock cycle when sequence is detected. Overlapping sequences allowed.`,
                difficulty: 'medium' as const,
                category: 'Finite State Machines',
                tags: ['fsm', 'sequential', 'pattern-detection'],
                points: 30,
                templateCode: `module sequence_detector(
  input data_in,
  input clk,
  input reset,
  output reg detected
);

  // Your code here

endmodule`,
                testbench: `module tb_seq;
  reg data_in, clk, reset;
  wire detected;
  
  sequence_detector uut (
    .data_in(data_in), .clk(clk), .reset(reset), .detected(detected)
  );
  
  initial clk = 0;
  always #5 clk = ~clk;
  
  initial begin
    reset = 1; data_in = 0; #15;
    reset = 0;
    
    // Sequence 1 0 1 1
    data_in = 1; #10;
    data_in = 0; #10;
    data_in = 1; #10;
    data_in = 1; #10;
    // Check detection (might be delayed if Mealy vs Moore mismatch, but Moore usually asserts in state after last input)
    // Actually spec says Moore, detects "1011".
    // 1->S1, 0->S2, 1->S3, 1->S4(detected=1)
    
    #1;
    if (detected !== 1) begin $display("FAIL: Sequence not detected"); $finish; end
    
    $display("PASS");
    $finish;
  end
endmodule`,
            },
            {
                title: 'Design a 4-bit ALU',
                slug: '4-bit-alu',
                description: `# 4-bit ALU

Design a 4-bit Arithmetic Logic Unit supporting ADD, SUB, AND, OR operations.

## Specifications
- **Inputs**: \`a[3:0]\`, \`b[3:0]\`, \`op[1:0]\`
- **Output**: \`result[3:0]\`
- **Operations**:
  - \`op = 00\`: ADD
  - \`op = 01\`: SUB
  - \`op = 10\`: AND
  - \`op = 11\`: OR`,
                difficulty: 'hard' as const,
                category: 'Arithmetic Circuits',
                tags: ['alu', 'arithmetic', 'logic'],
                points: 40,
                templateCode: `module alu_4bit(
  input [3:0] a,
  input [3:0] b,
  input [1:0] op,
  output reg [3:0] result
);

  // Your code here

endmodule`,
                testbench: `module tb_alu;
  reg [3:0] a, b;
  reg [1:0] op;
  wire [3:0] result;
  
  alu_4bit uut (
    .a(a), .b(b), .op(op), .result(result)
  );
  
  initial begin
    a = 3; b = 2;
    // ADD
    op = 0; #10;
    if (result !== 5) begin $display("FAIL: ADD"); $finish; end
    // SUB
    op = 1; #10;
    if (result !== 1) begin $display("FAIL: SUB"); $finish; end
    // AND
    op = 2; #10;
    if (result !== (3&2)) begin $display("FAIL: AND"); $finish; end
    // OR
    op = 3; #10;
    if (result !== (3|2)) begin $display("FAIL: OR"); $finish; end
    
    $display("PASS");
    $finish;
  end
endmodule`,
            },
            {
                title: 'Implement a FIFO Buffer',
                slug: 'fifo-buffer',
                description: `# FIFO Buffer

Implement a 4-deep, 8-bit FIFO buffer with full/empty flags.

## Specifications
- **Inputs**: \`data_in[7:0]\`, \`write_en\`, \`read_en\`, \`clk\`, \`reset\`
- **Outputs**: \`data_out[7:0]\`, \`full\`, \`empty\`
- **Behavior**: First-in-first-out storage with status flags`,
                difficulty: 'hard' as const,
                category: 'Memory Systems',
                tags: ['fifo', 'memory', 'buffer', 'sequential'],
                points: 50,
                templateCode: `module fifo_buffer(
  input [7:0] data_in,
  input write_en,
  input read_en,
  input clk,
  input reset,
  output reg [7:0] data_out,
  output full,
  output empty
);

  // Your code here

endmodule`,
                testbench: `module tb_fifo;
  reg [7:0] data_in;
  reg write_en, read_en, clk, reset;
  wire [7:0] data_out;
  wire full, empty;
  
  fifo_buffer uut (
    .data_in(data_in), .write_en(write_en), .read_en(read_en),
    .clk(clk), .reset(reset), .data_out(data_out),
    .full(full), .empty(empty)
  );
  
  initial clk=0; always #5 clk=~clk;
  
  initial begin
    reset = 1; write_en = 0; read_en = 0; #15;
    reset = 0;
    
    if (!empty) begin $display("FAIL: Should be empty"); $finish; end
    
    // Write 1
    write_en = 1; data_in = 8'hAA; #10;
    write_en = 0;
    if (empty) begin $display("FAIL: Should not be empty"); $finish; end
    
    $display("PASS");
    $finish;
  end
endmodule`,
            },
        ];

        for (const problem of problems) {
            await Problem.create(problem);
            console.log(`  ✓ Created problem: ${problem.title}`);
        }

        // Seed Quizzes
        console.log('\n📚 Seeding quizzes...');

        const quizzes = [
            {
                title: 'Digital Electronics Basics',
                category: 'Fundamentals',
                difficulty: 'easy' as const,
                duration: 15,
                questions: [
                    {
                        id: 'q1',
                        question: 'What is the output of a 2-input AND gate when both inputs are HIGH?',
                        options: ['LOW', 'HIGH', 'HIGH IMPEDANCE', 'UNDEFINED'],
                        correctAnswers: [1],
                        explanation: 'AND gate outputs HIGH only when all inputs are HIGH.',
                        points: 5,
                    },
                    {
                        id: 'q2',
                        question: 'Which of the following are universal gates? (Select all that apply)',
                        options: ['AND', 'NAND', 'OR', 'NOR'],
                        correctAnswers: [1, 3],
                        explanation: 'NAND and NOR are universal gates as any logic function can be implemented using only them.',
                        points: 10,
                    },
                    {
                        id: 'q3',
                        question: 'What is the decimal equivalent of binary 1010?',
                        options: ['8', '10', '12', '14'],
                        correctAnswers: [1],
                        explanation: '1010 in binary = 1×8 + 0×4 + 1×2 + 0×1 = 10 in decimal.',
                        points: 5,
                    },
                ],
            },
            {
                title: 'Verilog Fundamentals',
                category: 'Programming',
                difficulty: 'medium' as const,
                duration: 20,
                questions: [
                    {
                        id: 'q1',
                        question: 'Which keyword is used for combinational logic in Verilog?',
                        options: ['always @(*)', 'always @(posedge clk)', 'initial', 'wire'],
                        correctAnswers: [0],
                        explanation: 'always @(*) is used for combinational logic, sensitive to all inputs.',
                        points: 5,
                    },
                    {
                        id: 'q2',
                        question: 'What data types can be used for sequential logic outputs? (Select all)',
                        options: ['wire', 'reg', 'integer', 'parameter'],
                        correctAnswers: [1],
                        explanation: 'Only reg type can be used in always blocks for sequential logic.',
                        points: 10,
                    },
                    {
                        id: 'q3',
                        question: 'Which operator is used for bitwise XOR in Verilog?',
                        options: ['&', '|', '^', '~'],
                        correctAnswers: [2],
                        explanation: '^ is the bitwise XOR operator in Verilog.',
                        points: 5,
                    },
                ],
            },
            {
                title: 'Sequential Circuits',
                category: 'Advanced',
                difficulty: 'hard' as const,
                duration: 25,
                questions: [
                    {
                        id: 'q1',
                        question: 'What is the main difference between Moore and Mealy FSMs?',
                        options: [
                            'Moore outputs depend only on current state',
                            'Mealy outputs depend only on current state',
                            'Moore FSMs are faster',
                            'There is no difference',
                        ],
                        correctAnswers: [0],
                        explanation: 'Moore FSM outputs depend only on current state, while Mealy outputs depend on both state and inputs.',
                        points: 10,
                    },
                    {
                        id: 'q2',
                        question: 'Which of the following are types of flip-flops? (Select all)',
                        options: ['D', 'T', 'JK', 'SR'],
                        correctAnswers: [0, 1, 2, 3],
                        explanation: 'All four (D, T, JK, SR) are common types of flip-flops.',
                        points: 10,
                    },
                ],
            },
        ];

        for (const quiz of quizzes) {
            await Quiz.create(quiz);
            console.log(`  ✓ Created quiz: ${quiz.title}`);
        }

        // Seed Users
        console.log('\n👥 Seeding users...');

        const users = [
            {
                email: 'admin@eceplatform.com',
                password: await bcrypt.hash('admin123', 10),
                displayName: 'Admin User',
                username: 'admin',
                college: 'ECE Platform',
                branch: 'Administration',
                avatar: null,
                solvedProblems: [],
                totalPoints: 0,
                rank: 0,
            },
            {
                email: 'student@test.com',
                password: await bcrypt.hash('test123', 10),
                displayName: 'Test Student',
                username: 'student',
                college: 'Test University',
                branch: 'ECE',
                avatar: null,
                solvedProblems: [],
                totalPoints: 0,
                rank: 0,
            },
        ];

        for (const user of users) {
            await User.create(user);
            console.log(`  ✓ Created user: ${user.email}`);
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`  - ${problems.length} problems created`);
        console.log(`  - ${quizzes.length} quizzes created`);
        console.log(`  - ${users.length} users created`);

        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
