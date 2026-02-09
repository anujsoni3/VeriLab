import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SubjectCard from '../components/learning/SubjectCard';
import { Subject } from '../types/learning';
import { learningService } from '../services/learningService';
import { Sparkles } from 'lucide-react';

const Subjects: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await learningService.getSubjects();
                setSubjects(data);
            } catch (error) {
                console.error('Failed to fetch subjects', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <Sparkles size={16} />
                    Interactive Learning
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                    Master ECE Concepts
                </h1>
                <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                    Explore our expert-curated courses designed to take you from basics to advanced engineering.
                </p>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((subject) => (
                        <SubjectCard key={subject._id} subject={subject} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Subjects;
