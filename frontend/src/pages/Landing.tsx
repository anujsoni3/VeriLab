import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center max-w-3xl">
                <div className="mb-8 inline-flex items-center justify-center p-2 rounded-full bg-surface border border-border">
                    <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">New</span>
                    <span className="ml-2 text-sm text-text-secondary pr-2">The ECE Platform 2.0 is here</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-primary mb-6">
                    Master Verilog. <br />
                    <span className="text-primary">Build Hardware.</span>
                </h1>
                <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                    A professional platform for ECE students to practice hardware description languages, compete in challenges, and track their progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/signup"
                        className="btn btn-primary h-12 px-8 text-base"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="btn btn-secondary h-12 px-8 text-base"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
