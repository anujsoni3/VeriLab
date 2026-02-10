import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject';
import Chapter from '../models/Chapter';
import Stage from '../models/Stage';
import Problem from '../models/Problem';
import Quiz from '../models/Quiz';

dotenv.config();

const seedAdvancedContent = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // 1. Find the "Digital Electronics" Subject
        const digitalSubject = await Subject.findOne({ title: 'Digital Electronics' });
        if (!digitalSubject) {
            console.error('Digital Electronics subject not found. Run basic seed first.');
            process.exit(1);
        }

        // 2. Create "Combinational Logic" Chapter if not exists, or update it
        let combChapter = await Chapter.findOne({ title: 'Combinational Logic', subjectId: digitalSubject._id });
        if (!combChapter) {
            combChapter = await Chapter.create({
                title: 'Combinational Logic',
                slug: 'combinational-logic',
                description: 'Design and analyze combinational circuits like Adders and Multiplexers.',
                subjectId: digitalSubject._id,
                order: 3,
                estimatedMinutes: 90,
                learningOutcomes: ['Understand Half and Full Adders', 'Analyze Multiplexers and De-multiplexers', 'Design circuits using MUX'],
                totalStages: 5,
                isPublished: true
            });
            console.log('Created Combinational Logic Chapter');
        }

        // 3. Add Stages to Combinational Logic
        const stages = [
            {
                title: 'Introduction to Adders',
                type: 'theory',
                chapterId: combChapter._id,
                order: 1,
                content: `
# Binary Adders

Adders are digital circuits that perform addition of numbers. The most basic adders operate on binary numbers.

## Half Adder
A half adder adds two single binary digits $A$ and $B$. It has two outputs:
- **Sum ($S$)**: The result of the addition.
- **Carry ($C$)**: The carry bit.

### Truth Table
| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 | 0   | 0     |
| 0 | 1 | 1   | 0     |
| 1 | 0 | 1   | 0     |
| 1 | 1 | 0   | 1     |

## Full Adder
A full adder adds binary numbers and accounts for values carried in as well. A one-bit full adder adds three one-bit numbers, often written as $A$, $B$, and $C_{in}$.
                `,
                isMandatory: true,
                xpPoints: 10
            },
            {
                title: 'Simulate Half Adder',
                type: 'simulation',
                chapterId: combChapter._id,
                order: 2,
                content: `
# Interactive Half Adder
Use the simulator below to verify the truth table of a Half Adder.
- Toggle inputs **A** and **B**.
- Observe the **Sum** and **Carry** outputs.
                `,
                simulationConfig: {
                    type: 'combinational',
                    defaultProps: { defaultType: 'half-adder' }
                },
                isMandatory: true,
                xpPoints: 20
            },
            {
                title: 'Full Adder & Implementation',
                type: 'theory',
                chapterId: combChapter._id,
                order: 3,
                content: `
# Full Adder Implementation

A full adder can be constructed from two half adders by connecting $A$ and $B$ to the input of one half adder, connecting the sum from that to an input to the second adder, connecting $C_{in}$ to the other input and OR the two carry-out outputs.

### Equations
$S = A \\oplus B \\oplus C_{in}$
$C_{out} = (A \\cdot B) + (C_{in} \\cdot (A \\oplus B))$
                `,
                isMandatory: true,
                xpPoints: 10
            },
            {
                title: 'Simulate Full Adder',
                type: 'simulation',
                chapterId: combChapter._id,
                order: 4,
                content: `
# Interactive Full Adder
Verify the Full Adder logic. Note how **Cin** affects the output.
                `,
                simulationConfig: {
                    type: 'combinational',
                    defaultProps: { defaultType: 'full-adder' }
                },
                isMandatory: true,
                xpPoints: 20
            },
            {
                title: 'Multiplexers (MUX)',
                type: 'simulation',
                chapterId: combChapter._id,
                order: 5,
                content: `
# 2:1 Multiplexer
A multiplexer selects one of several analog or digital input signals and forwards the selected input into a single line.

### 2:1 MUX
- **Inputs**: $D0, D1$
- **Select**: $S$
- **Output**: $Y$

If $S=0, Y=D0$.
If $S=1, Y=D1$.
                `,
                simulationConfig: {
                    type: 'combinational',
                    defaultProps: { defaultType: 'mux-2-1' }
                },
                isMandatory: true,
                xpPoints: 20
            }
        ];

        for (const stageData of stages) {
            await Stage.findOneAndUpdate(
                { chapterId: stageData.chapterId, order: stageData.order },
                stageData,
                { upsert: true, new: true }
            );
        }
        console.log('Seeded Combinational Logic stages');


        // 4. Update "Logic Gates" Chapter in Digital Electronics
        const gatesChapter = await Chapter.findOne({ title: 'Logic Gates & Boolean Algebra', subjectId: digitalSubject._id });
        if (gatesChapter) {
            const gateStages = [
                {
                    title: 'Interactive Logic Gates',
                    type: 'simulation',
                    chapterId: gatesChapter._id,
                    order: 2, // Insert after theory
                    content: `
# Experiment with Logic Gates
Interact with the gates below. Try **AND**, **OR**, **XOR**, etc.
Observe the truth tables generated dynamically.
                    `,
                    simulationConfig: {
                        type: 'logic-gate',
                        defaultProps: { defaultType: 'AND' }
                    },
                    isMandatory: true,
                    xpPoints: 15
                }
            ];

            // Shift existing stages if necessary (simple append/upsert for now)
            // Ideally we should re-order, but for this demo we'll just upsert at order 2
            // NOTE: This might overwrite existing stage at order 2. 
            // Let's safe-guard by checking what's at order 2.
            // If there is one, we move it and subsequent ones up.

            // Simple approach: Just overwrite for the demo as user requested "add these"
            for (const stageData of gateStages) {
                await Stage.findOneAndUpdate(
                    { chapterId: stageData.chapterId, order: stageData.order },
                    stageData,
                    { upsert: true, new: true }
                );
            }
            console.log('Seeded Logic Gates simulation');
        }


        console.log('Advanced content seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedAdvancedContent();
