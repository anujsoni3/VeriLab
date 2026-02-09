import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Stage from '../models/Stage.js';
import Problem from '../models/Problem.js';
import Quiz from '../models/Quiz.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedLearningData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        // Clear existing learning data
        await Subject.deleteMany({});
        await Chapter.deleteMany({});
        await Stage.deleteMany({});

        // --- 1. DIGITAL ELECTRONICS ---
        const digitalElectronics = await Subject.create({
            title: 'Digital Electronics',
            slug: 'digital-electronics',
            description: 'Master the fundamentals of digital logic, boolean algebra, and circuit design.',
            icon: 'Cpu', // Lucide icon name
            estimatedHours: 40,
            difficulty: 'Beginner',
            order: 1,
            isPublished: true,
        });

        // Chapter 1: Logic Gates
        const logicGates = await Chapter.create({
            title: 'Logic Gates & Boolean Algebra',
            slug: 'logic-gates',
            description: 'Introduction to basic logic gates (AND, OR, NOT) and Boolean laws.',
            subjectId: digitalElectronics._id,
            order: 1,
            estimatedMinutes: 120,
            learningOutcomes: ['Understand basic gates', 'Simplify Boolean expressions', 'Design simple circuits'],
            isPublished: true,
        });

        // Stages for Logic Gates
        await Stage.create([
            {
                title: 'Introduction to Logic Gates',
                type: 'theory',
                chapterId: logicGates._id,
                order: 1,
                content: '# Logic Gates\n\nLogic gates are the building blocks of digital circuits...',
                isMandatory: true,
                xpPoints: 10,
            },
            {
                title: 'AND, OR, NOT Gates',
                type: 'theory',
                chapterId: logicGates._id,
                order: 2,
                content: '# Basic Gates\n\n## AND Gate\nThe output is high only when all inputs are high...',
                isMandatory: true,
                xpPoints: 10,
            },
            {
                title: 'Basic Gates Quiz',
                type: 'quiz',
                chapterId: logicGates._id,
                order: 3,
                // We would link a real Quiz ID here if we created one
                isMandatory: true,
                xpPoints: 20,
            },
            {
                title: 'Design a Majority Circuit',
                type: 'problem',
                chapterId: logicGates._id,
                order: 4,
                // We would link a real Problem ID here
                isMandatory: true,
                xpPoints: 50,
            }
        ]);

        // Chapter 2: Combinational Circuits
        const combinational = await Chapter.create({
            title: 'Combinational Circuits',
            slug: 'combinational-circuits',
            description: 'Design and analysis of adders, subtractors, multiplexers, and decoders.',
            subjectId: digitalElectronics._id,
            order: 2,
            estimatedMinutes: 180,
            learningOutcomes: ['Design Adders/Subtractors', 'Understand Mux/Demux', 'Encoders & Decoders'],
            isPublished: true,
        });

        // Stages for Combinational
        await Stage.create([
            {
                title: 'Half Adder & Full Adder',
                type: 'theory',
                chapterId: combinational._id,
                order: 1,
                content: '# Adders\n\nAdders are digital circuits that perform addition of numbers...',
                isMandatory: true,
                xpPoints: 15,
            },
            {
                title: 'Implement a Full Adder',
                type: 'practice',
                chapterId: combinational._id,
                order: 2,
                codeSnippet: '// Verilog code for Full Adder\nmodule full_adder(input a, b, cin, output sum, cout);\n  // Write your code here\nendmodule',
                isMandatory: true,
                xpPoints: 30,
            }
        ]);


        // --- 2. VERILOG PROGRAMMING ---
        const verilog = await Subject.create({
            title: 'Verilog Programming',
            slug: 'verilog-programming',
            description: 'Learn Hardware Description Language (HDL) for FPGA and ASIC design.',
            icon: 'Code',
            estimatedHours: 50,
            difficulty: 'Intermediate',
            order: 2,
            isPublished: true,
        });

        // Chapter 1: Verilog Basics
        const verilogBasics = await Chapter.create({
            title: 'Verilog Syntax & Structure',
            slug: 'verilog-basics',
            description: 'Modules, ports, data types, and operators in Verilog.',
            subjectId: verilog._id,
            order: 1,
            estimatedMinutes: 90,
            learningOutcomes: ['Define Modules', 'Use Wire/Reg types', 'Vector operations'],
            isPublished: true,
        });

        await Stage.create([
            {
                title: 'Modules and Ports',
                type: 'theory',
                chapterId: verilogBasics._id,
                order: 1,
                content: '# Modules\n\nA module is the basic building block in Verilog...',
                isMandatory: true,
                xpPoints: 10,
            },
            {
                title: 'Hello World (Counter)',
                type: 'practice',
                chapterId: verilogBasics._id,
                order: 2,
                codeSnippet: 'module counter(input clk, output [3:0] out);\n  // Implement a 4-bit counter\nendmodule',
                isMandatory: true,
                xpPoints: 20,
            }
        ]);


        console.log('Database seeded successfully via Antigravity!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedLearningData();
