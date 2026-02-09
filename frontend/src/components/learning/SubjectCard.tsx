import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ChevronRight, Cpu, Code, Layers, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Subject } from '../../types/learning';

// Map icon strings to Lucide components
const iconMap: Record<string, React.ElementType> = {
    Cpu,
    Code,
    Layers,
    Zap,
};

interface SubjectCardProps {
    subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
    const Icon = iconMap[subject.icon] || Layers;

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(var(--color-primary), 0.3)' }}
            className="bg-surface border border-border rounded-xl overflow-hidden shadow-lg transition-all duration-300"
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <Icon size={32} />
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${subject.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-500' :
                            subject.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-red-500/10 text-red-500'
                        }`}>
                        {subject.difficulty}
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-text-primary">{subject.title}</h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">{subject.description}</p>

                <div className="flex items-center gap-4 text-xs text-text-secondary mb-6">
                    <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{subject.totalChapters} Chapters</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{subject.estimatedHours}h</span>
                    </div>
                </div>

                {/* Progress Bar (Mock for now) */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">Progress</span>
                        <span className="text-primary font-medium">{subject.progress || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${subject.progress || 0}%` }}
                        />
                    </div>
                </div>

                <Link
                    to={`/subjects/${subject._id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium text-sm"
                >
                    {subject.progress && subject.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    <ChevronRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
};

export default SubjectCard;
