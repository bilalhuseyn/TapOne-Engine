"use client";

import { useState } from 'react';
import { ArrowRight, Hexagon, Shield, Globe } from 'lucide-react';

interface LoginProps {
    onLogin: (userId: string) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setIsLoading(true);
            // Simulate network delay for premium feel
            setTimeout(() => {
                onLogin(input.trim());
            }, 800);
        }
    };

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

            {/* Left Column - Brand Experience */}
            <div className="relative hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black overflow-hidden p-12">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 text-center space-y-8">
                    <div className="mx-auto w-24 h-24 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                        <Hexagon className="w-12 h-12 text-indigo-400" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-5xl font-bold text-white tracking-tight">TapOne</h1>
                        <p className="text-xl text-indigo-200 font-light tracking-wide">The Future of Embedded Finance</p>
                    </div>

                    <div className="grid grid-cols-3 gap-8 pt-12 text-indigo-300/60 max-w-lg mx-auto">
                        <div className="flex flex-col items-center space-y-2">
                            <Shield className="w-6 h-6" />
                            <span className="text-xs uppercase tracking-widest">Secure</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <Globe className="w-6 h-6" />
                            <span className="text-xs uppercase tracking-widest">Global</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <ArrowRight className="w-6 h-6" />
                            <span className="text-xs uppercase tracking-widest">Instant</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-0 w-full text-center">
                    <p className="text-indigo-400/40 text-xs font-mono">SECURED BY TAPONE CORE &bull; VER 2.4.0</p>
                </div>
            </div>

            {/* Right Column - Access Terminal */}
            <div className="flex flex-col justify-center items-center bg-slate-950 p-8 lg:p-12 relative">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="inline-flex lg:hidden items-center justify-center w-12 h-12 bg-indigo-900/50 rounded-xl mb-4 text-indigo-400">
                            <Hexagon className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-gray-400">Enter your credentials to access the terminal.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="userId" className="text-sm font-medium text-gray-300 ml-1">
                                User ID
                            </label>
                            <div className="relative group">
                                <input
                                    id="userId"
                                    type="text"
                                    required
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all group-hover:border-slate-700"
                                    placeholder="e.g. user-01"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-4 py-4 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-900/20 flex items-center justify-center space-x-2 ${isLoading ? 'opacity-80 cursor-wait' : 'hover:shadow-indigo-600/30'}`}
                        >
                            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-gray-900 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Contact Sales</span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

