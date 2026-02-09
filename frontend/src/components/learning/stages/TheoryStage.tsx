import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Stage } from '../../../types/learning';
import { Play } from 'lucide-react';

interface TheoryStageProps {
    stage: Stage;
}

const TheoryStage: React.FC<TheoryStageProps> = ({ stage }) => {
    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{stage.title}</h1>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>

            <div className="prose prose-invert max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-strong:text-text-primary prose-code:text-primary">
                <ReactMarkdown
                    components={{
                        code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <div className="rounded-lg overflow-hidden my-6 shadow-xl border border-border">
                                    <div className="bg-surface px-4 py-2 border-b border-border flex items-center justify-between">
                                        <span className="text-xs text-text-secondary font-mono">{match[1]}</span>
                                        <button className="p-1 hover:bg-white/10 rounded transition-colors" title="Run Code">
                                            <Play size={14} className="text-green-400" />
                                        </button>
                                    </div>
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{ margin: 0, borderRadius: 0 }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            ) : (
                                <code className="bg-surface px-1.5 py-0.5 rounded text-sm text-primary font-mono" {...props}>
                                    {children}
                                </code>
                            );
                        },
                        // Enhance other markdown elements if needed
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-primary pl-4 py-1 my-4 bg-primary/5 rounded-r italic text-text-secondary">
                                {children}
                            </blockquote>
                        )
                    }}
                >
                    {stage.content || 'No content provided for this theory stage.'}
                </ReactMarkdown>
            </div>

            {stage.codeSnippet && (
                <div className="mt-8 p-6 bg-surface border border-border rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">Example</span>
                        Interactive Example
                    </h3>
                    <div className="bg-[#1e1e1e] rounded-lg overflow-hidden p-4 font-mono text-sm text-gray-300">
                        <pre>{stage.codeSnippet}</pre>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-secondary hover:bg-secondary-hover text-white rounded-lg text-sm font-medium transition-colors">
                        Try it Yourself
                    </button>
                </div>
            )}
        </div>
    );
};

export default TheoryStage;
