import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Layers } from 'lucide-react';
import ChapterCard from '../components/learning/ChapterCard';
import { Subject, Chapter } from '../types/learning';
import { learningService } from '../services/learningService';

const Chapters: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const { subject, chapters } = await learningService.getSubject(id);
                setSubject(subject);
                setChapters(chapters);
            } catch (error) {
                console.error('Failed to fetch chapters', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen pt-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!subject) return <div className="pt-20 text-center">Subject not found</div>;

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
            <Link
                to="/subjects"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8"
            >
                <ChevronLeft size={20} />
                Back to Subjects
            </Link>

            <div className="flex items-center gap-6 mb-12">
                <div className="p-4 bg-primary/10 rounded-xl text-primary">
                    <Layers size={40} />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{subject.title}</h1>
                    <p className="text-text-secondary">{subject.description}</p>
                </div>
            </div>

            <div className="space-y-6">
                {chapters.map((chapter, index) => (
                    <ChapterCard key={chapter._id} chapter={chapter} index={index} />
                ))}
            </div>
        </div>
    );
};

export default Chapters;
