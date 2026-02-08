
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../src/models/Quiz';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const questionsDE = [
    {
        question: "What is the primary difference between a latch and a flip-flop?",
        options: ["Latch is edge-triggered, flip-flop is level-triggered", "Latch is level-triggered, flip-flop is edge-triggered", "Latch has a clock, flip-flop does not", "Flip-flop is faster than a latch"],
        correctAnswers: [1],
        explanation: "Latches are level-sensitive, meaning their output can change as long as the clock signal is high (or low). Flip-flops are edge-triggered, meaning they only change state on the rising or falling edge of the clock.",
        points: 10
    },
    {
        question: "Which logic gate is known as the 'universal gate'?",
        options: ["AND", "OR", "NAND", "XOR"],
        correctAnswers: [2],
        explanation: "NAND and NOR gates are universal gates because any other logic gate can be constructed using only a combination of them.",
        points: 10
    },
    {
        question: "Simplifying the boolean expression A + AB results in:",
        options: ["AB", "B", "A", "A + B"],
        correctAnswers: [2],
        explanation: "Using the absorption law: A + AB = A(1 + B) = A(1) = A.",
        points: 10
    },
    {
        question: "What does FSM stand for in digital design?",
        options: ["Fast State Machine", "Finite State Memory", "Finite State Machine", "Frequency Shift Modulation"],
        correctAnswers: [2],
        explanation: "FSM stands for Finite State Machine, a computational model used to design sequential logic circuits.",
        points: 10
    },
    {
        question: "In a 4-variable K-map, how many cells are there?",
        options: ["8", "12", "16", "32"],
        correctAnswers: [2],
        explanation: "A K-map for n variables has 2^n cells. For 4 variables, 2^4 = 16 cells.",
        points: 10
    }
];

const questionsVerilog = [
    {
        question: "What is the difference between 'wire' and 'reg' in Verilog?",
        options: ["'wire' stores value, 'reg' does not", "'reg' stores value, 'wire' does not", "Both store values", "Neither stores values"],
        correctAnswers: [1],
        explanation: "'reg' data types can hold a value (like a variable), while 'wire' data types are used for connecting components and do not store a value.",
        points: 10
    },
    {
        question: "Which keyword is used to define a module in Verilog?",
        options: ["class", "struct", "module", "unit"],
        correctAnswers: [2],
        explanation: "The 'module' keyword is used to define the basic building block in Verilog.",
        points: 10
    },
    {
        question: "What does 'always @(posedge clk)' signify?",
        options: ["Execute on falling edge of clock", "Execute on rising edge of clock", "Execute when clock is high", "Execute when clock is low"],
        correctAnswers: [1],
        explanation: "'posedge' stands for positive edge (rising edge), so the block executes when the clock signal transitions from 0 to 1.",
        points: 10
    },
    {
        question: "How do you implement a non-blocking assignment?",
        options: ["=", "<=", ":=", "=>"],
        correctAnswers: [1],
        explanation: "Non-blocking assignments use the '<=' operator and are used to model sequential logic where updates happen concurrently at the end of the time step.",
        points: 10
    },
    {
        question: "What is the purpose of a testbench in Verilog?",
        options: ["To synthesize the circuit", "To simulate and verify the design", "To place and route the design", "To program the FPGA"],
        correctAnswers: [1],
        explanation: "A testbench is a Verilog module used to generate stimuli for a design and verify its output through simulation.",
        points: 10
    }
];

const seedQuizzes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Clear existing quizzes
        await Quiz.deleteMany({});
        console.log('Cleared existing quizzes');

        const chapters = [
            { name: 'Digital Electronics', questions: questionsDE },
            { name: 'Verilog', questions: questionsVerilog }
        ];

        for (const chapter of chapters) {
            console.log(`Seeding chapter: ${chapter.name}`);
            for (let stage = 1; stage <= 10; stage++) {
                // Generate slightly variations or reuse questions for demo
                const quizQuestions = chapter.questions.map(q => ({
                    ...q,
                    id: uuidv4(),
                    question: `${q.question} (Stage ${stage})` // Just to differentiate
                }));

                const quiz = new Quiz({
                    title: `${chapter.name} - Stage ${stage}`,
                    category: chapter.name,
                    difficulty: stage <= 3 ? 'easy' : stage <= 7 ? 'medium' : 'hard',
                    chapter: chapter.name,
                    stage: stage,
                    duration: 15 * 60, // 15 minutes
                    questions: quizQuestions,
                });

                await quiz.save();
                console.log(`Created ${chapter.name} Stage ${stage}`);
            }
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedQuizzes();
