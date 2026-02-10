import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ChevronLeft, ChevronRight, CheckCircle, Lock,
    FileText, Code, HelpCircle, Cpu,
    Maximize2, Minimize2
} from 'lucide-react';
import { Stage } from '../../types/learning';
import { Link, useNavigate } from 'react-router-dom';

interface StageLayoutProps {
    stages: Stage[];
    currentStageIdx: number;
    chapterTitle: string;
    onStageSelect: (index: number) => void;
    onNext: () => void;
    onPrev: () => void;
    isLoading?: boolean;
    children: React.ReactNode;
}

const StageLayout: React.FC<StageLayoutProps> = ({
    stages,
    currentStageIdx,
    chapterTitle,
    onStageSelect,
    onNext,
    onPrev,
    isLoading = false,
    children
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const currentStage = stages[currentStageIdx];
    const progress = ((currentStageIdx) / stages.length) * 100;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full h-14 bg-surface border-b border-border z-50 flex items-center justify-between px-4">
                <button onClick={toggleSidebar} className="p-2 text-text-primary">
                    <Menu size={20} />
                </button>
                <span className="font-semibold truncate">{chapterTitle}</span>
                <button onClick={() => navigate('/dashboard')} className="p-2 text-text-primary">
                    <X size={20} />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <AnimatePresence mode='wait'>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -250, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -250, opacity: 0 }}
                        className={`
                            fixed md:relative z-40 h-full w-64 bg-surface border-r border-border flex flex-col
                            ${!isSidebarOpen && 'hidden md:flex'}
                        `}
                    >
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h2 className="font-bold text-lg truncate" title={chapterTitle}>
                                {chapterTitle}
                            </h2>
                            <button onClick={toggleSidebar} className="md:hidden p-1">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto py-2">
                            {stages.map((stage, idx) => {
                                const isActive = idx === currentStageIdx;
                                const isCompleted = idx < currentStageIdx; // Simplification for now
                                const isLocked = idx > currentStageIdx; // Simplification

                                const Icon = stage.type === 'practice' ? Code : stage.type === 'quiz' ? HelpCircle : stage.type === 'simulation' ? Cpu : FileText;

                                return (
                                    <button
                                        key={stage._id}
                                        onClick={() => !isLocked && onStageSelect(idx)}
                                        disabled={isLocked}
                                        className={`
                                            w-full px-4 py-3 flex items-center gap-3 transition-colors text-left
                                            ${isActive ? 'bg-primary/10 border-r-4 border-primary' : 'hover:bg-surface-hover'}
                                            ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                    >
                                        <div className={`
                                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs
                                            ${isActive ? 'bg-primary text-white' :
                                                isCompleted ? 'bg-success text-white' :
                                                    'bg-border text-text-secondary'
                                            }
                                        `}>
                                            {isCompleted ? <CheckCircle size={14} /> : isLocked ? <Lock size={12} /> : <Icon size={14} />}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-text-primary'}`}>
                                                {stage.title}
                                            </p>
                                            <span className="text-xs text-text-secondary capitalize">{stage.type}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-border">
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
                                <ChevronLeft size={16} />
                                Back to Dashboard
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col h-full relative">
                {/* Top Bar */}
                <div className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="hidden md:flex p-2 hover:bg-surface-hover rounded-lg transition-colors text-text-secondary"
                        >
                            {isSidebarOpen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        <div className="hidden md:block h-6 w-[1px] bg-border mx-2"></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-text-secondary uppercase tracking-wider">
                                Stage {currentStageIdx + 1} of {stages.length}
                            </span>
                            <span className="text-sm font-semibold text-text-primary">{currentStage?.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Progress Bar in Header */}
                        <div className="hidden sm:block w-32 md:w-48">
                            <div className="h-2 bg-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-border">
                            {currentStage?.xpPoints || 0} XP
                        </div>
                    </div>
                </div>

                {/* Content Render Area */}
                <div className="flex-grow overflow-y-auto bg-background p-4 md:p-8 relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <motion.div
                            key={currentStage?._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    )}
                </div>

                {/* Bottom Navigation */}
                <div className="h-16 border-t border-border bg-surface flex items-center justify-between px-4 md:px-8">
                    <button
                        onClick={onPrev}
                        disabled={currentStageIdx === 0}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${currentStageIdx === 0
                                ? 'text-text-secondary opacity-50 cursor-not-allowed'
                                : 'text-text-primary hover:bg-surface-hover'
                            }
                        `}
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>

                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-primary/25 transition-all"
                    >
                        {currentStageIdx === stages.length - 1 ? 'Complete Chapter' : 'Next Stage'}
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StageLayout;
