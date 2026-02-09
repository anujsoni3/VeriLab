import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Clock, Trophy, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chapter } from '../../types/learning';

interface ChapterCardProps {
    chapter: Chapter;
    index: number;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, index }) => {
    const isLocked = chapter.isLocked;
    const isCompleted = chapter.status === 'completed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative group border rounded-xl overflow-hidden transition-all duration-300 ${isLocked
                    ? 'bg-surface/50 border-border opacity-70 cursor-not-allowed'
                    : 'bg-surface border-border hover:border-primary/50 hover:shadow-lg'
                }`}
        >
            <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* Number Badge */}
                <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${isCompleted ? 'bg-success/10 border-success text-success' :
                            isLocked ? 'bg-border/50 border-border text-text-secondary' :
                                'bg-primary/10 border-primary text-primary'
                        }`}>
                        {isCompleted ? <CheckCircle2 size={24} /> : chapter.order}
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold ${isLocked ? 'text-text-secondary' : 'text-text-primary'}`}>
                            {chapter.title}
                        </h3>
                        {isLocked && <Lock size={20} className="text-text-secondary" />}
                    </div>

                    <p className="text-text-secondary text-sm mb-4">{chapter.description}</p>

                    <div className="flex flex-wrap gap-4 text-xs text-text-secondary mb-4">
                        <div className="flex items-center gap-1 bg-background px-2 py-1 rounded">
                            <Clock size={14} />
                            <span>{chapter.estimatedMinutes} mins</span>
                        </div>
                        <div className="flex items-center gap-1 bg-background px-2 py-1 rounded">
                            <Trophy size={14} />
                            <span>{chapter.totalStages} Stages</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Learning Outcomes:</p>
                        <ul className="text-sm text-text-secondary list-disc list-inside">
                            {chapter.learningOutcomes.slice(0, 3).map((outcome, idx) => (
                                <li key={idx}>{outcome}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Action Area */}
                <div className="flex flex-col justify-center items-end min-w-[120px]">
                    {!isLocked ? (
                        <Link
                            to={`/learning/${chapter._id}`}
                            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            Start
                            <PlayCircle size={18} />
                        </Link>
                    ) : (
                        <div className="px-6 py-2.5 bg-border text-text-secondary rounded-lg font-medium text-sm">
                            Locked
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Line Connector (Visual only) */}
            {!isLocked && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-border/30">
                    <div
                        className="h-full bg-primary"
                        style={{ width: chapter.status === 'completed' ? '100%' : chapter.status === 'in-progress' ? '30%' : '0%' }}
                    />
                </div>
            )}
        </motion.div>
    );
};

export default ChapterCard;
