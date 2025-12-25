'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import { DollarSign, RefreshCw, ShieldCheck } from 'lucide-react';

export function AdminProfit() {
    const [revenue, setRevenue] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchRevenue = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/wallet/treasury');
            setRevenue(Number(res.data.totalRevenueAZN));
        } catch (err) {
            console.error('Failed to fetch treasury', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRevenue();
    }, [fetchRevenue]);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-900/10 to-black p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-64 h-64 text-yellow-500" />
            </div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <DollarSign className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="text-yellow-500 font-semibold tracking-wide uppercase text-xs">Admin Treasury</h3>
                        <p className="text-gray-300 text-sm">Total System Revenue</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-sm text-yellow-500/50 uppercase tracking-widest font-mono mb-1">Total Revenue</div>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 font-mono drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                            {revenue.toFixed(2)} <span className="text-xl text-yellow-500/50">AZN</span>
                        </div>
                    </div>

                    <button
                        onClick={fetchRevenue}
                        className={`p-3 hover:bg-yellow-500/10 rounded-full transition-colors border border-yellow-500/20 hover:border-yellow-500/50 ${loading ? 'animate-spin' : ''}`}
                        title="Refresh Revenue"
                    >
                        <RefreshCw className="w-5 h-5 text-yellow-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}
