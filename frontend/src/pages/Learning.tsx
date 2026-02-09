import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StageLayout from '../components/learning/StageLayout';
import TheoryStage from '../components/learning/stages/TheoryStage';
import PracticeStage from '../components/learning/stages/PracticeStage';
import { Chapter, Stage } from '../types/learning';
import { learningService } from '../services/learningService';

const Learning: React.FC = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [stages, setStages] = useState<Stage[]>([]);
    const [currentStageIdx, setCurrentStageIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(false);
    const [currentStageData, setCurrentStageData] = useState<Stage | null>(null);

    // Fetch Chapter Context
    useEffect(() => {
        const fetchChapter = async () => {
            if (!chapterId) return;
            try {
                const { chapter, stages } = await learningService.getChapter(chapterId);
                setChapter(chapter);
                setStages(stages);
                // Default to first stage
                loadStageContent(stages[0]?._id);
            } catch (error) {
                console.error('Failed to fetch chapter', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [chapterId]);

    const loadStageContent = async (stageId: string) => {
        if (!stageId) return;
        setContentLoading(true);
        try {
            const data = await learningService.getStage(stageId);
            setCurrentStageData(data);
        } catch (error) {
            console.error('Failed to load stage content', error);
        } finally {
            setContentLoading(false);
        }
    };

    const handleStageSelect = (index: number) => {
        setCurrentStageIdx(index);
        loadStageContent(stages[index]._id);
    };

    const handleNext = () => {
        if (currentStageIdx < stages.length - 1) {
            handleStageSelect(currentStageIdx + 1);
        } else {
            // Chapter Complete Logic (Redirect or Show Celebration)
            navigate('/dashboard');
        }
    };

    const handlePrev = () => {
        if (currentStageIdx > 0) {
            handleStageSelect(currentStageIdx - 1);
        }
    };

    if (loading || !chapter) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Determine which component to render based on stage type
    const renderStageContent = () => {
        if (!currentStageData) return null;

        switch (currentStageData.type) {
            case 'theory':
                return <TheoryStage stage={currentStageData} />;
            case 'practice':
                return <PracticeStage stage={currentStageData} />;
            case 'quiz':
                return <div className="p-8 text-center text-text-secondary">Quiz Component Implementation Required</div>; // Placeholder
            case 'problem':
                return <div className="p-8 text-center text-text-secondary">Problem Solving Component Implementation Required</div>; // Placeholder
            default:
                return <div>Unknown Stage Type</div>;
        }
    };

    return (
        <StageLayout
            stages={stages}
            currentStageIdx={currentStageIdx}
            chapterTitle={chapter.title}
            onStageSelect={handleStageSelect}
            onNext={handleNext}
            onPrev={handlePrev}
            isLoading={contentLoading}
        >
            {renderStageContent()}
        </StageLayout>
    );
};

export default Learning;
