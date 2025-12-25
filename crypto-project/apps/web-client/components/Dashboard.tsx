"use client";

import { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import { Faucet } from './Faucet';
import { Trade } from './Trade';
import { RecentActivity } from './RecentActivity';
import {
    LogOut,
    User,
    ChevronDown,
    ChevronUp,
    LineChart
} from 'lucide-react';

interface DashboardProps {
    userId: string;
    onLogout: () => void;
}

export function Dashboard({ userId, onLogout }: DashboardProps) {
    const [balances, setBalances] = useState<{ AZN: number; USDT: number }>({
        AZN: 0,
        USDT: 0,
    });

    const [currentPrice, setCurrentPrice] = useState<number>(1.70);
    const [previousPrice, setPreviousPrice] = useState<number>(1.70);
    const [showChart, setShowChart] = useState(false);

    const fetchBalances = useCallback(async () => {
        try {
            const res = await api.get(`/wallet/balance/${userId}`);
            setBalances({
                AZN: Number(res.data.AZN || 0),
                USDT: Number(res.data.USDT || 0),
            });
        } catch (err) {
            console.error('Failed to fetch balances', err);
        }
    }, [userId]);

    const fetchPrice = useCallback(async () => {
        try {
            const res = await api.get('/wallet/price');
            const newPrice = Number(res.data.price);
            setCurrentPrice(prev => {
                setPreviousPrice(prev);
                return newPrice;
            });
        } catch (err) {
            console.error('Failed to fetch price', err);
        }
    }, []);

    useEffect(() => {
        fetchBalances();
        fetchPrice();
        const interval = setInterval(fetchPrice, 3000);
        return () => clearInterval(interval);
    }, [fetchBalances, fetchPrice]);

    const totalEstimatedBalance = balances.AZN + (balances.USDT * 1.7);

    return (
        <div className="min-h-screen bg-slate-950 text-gray-200 font-sans selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto p-6 space-y-8">

                {/* 1. Header & Profile */}
                <header className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-white text-lg">T</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-lg tracking-tight">TapOne</h1>
                            <p className="text-xs text-gray-500 font-medium">Enterprise SDK Demo</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                            <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-300">{userId}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* 2. Premium Balance Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-2">Total Estimated Balance</p>
                            <h2 className="text-5xl font-mono font-bold text-white tracking-tighter">
                                {totalEstimatedBalance.toFixed(2)} <span className="text-2xl text-gray-500 font-normal">AZN</span>
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">USDT</p>
                                <p className="font-mono text-xl text-white">{balances.USDT.toFixed(2)}</p>
                            </div>
                            <div className="w-px bg-slate-800 h-12"></div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">AZN</p>
                                <p className="font-mono text-xl text-white">{balances.AZN.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Actions & Chart Toggle */}
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Quick Trade</h3>
                    <button
                        onClick={() => setShowChart(!showChart)}
                        className="flex items-center space-x-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                    >
                        <LineChart className="w-4 h-4" />
                        <span>{showChart ? 'Hide Chart' : 'Show Chart'}</span>
                        {showChart ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </div>

                {/* 4. Chart Area (Conditional) */}
                {showChart && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-300">
                        <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                            <div className="text-center">
                                <LineChart className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                <span className="text-slate-600 font-medium">Market Data Visualization</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. Trade Widget */}
                <Trade
                    userId={userId}
                    onSuccess={fetchBalances}
                    currentPrice={currentPrice}
                    availUsdt={balances.USDT}
                    availAzn={balances.AZN}
                />

                {/* 6. Recent Activity */}
                <div className="pt-8">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
                    <RecentActivity userId={userId} />
                </div>

                {/* 7. Footer / Faucet */}
                <div className="mt-12 border-t border-slate-800 pt-8 flex justify-center">
                    <div className="w-full max-w-md">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 mb-4">Need test funds for development?</p>
                            <Faucet userId={userId} onSuccess={fetchBalances} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
