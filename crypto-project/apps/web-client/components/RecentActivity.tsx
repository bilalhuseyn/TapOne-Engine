'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'BUY' | 'SELL';
    status: string;
    amount: string;
    currency: string;
    sign: string;
    createdAt: string;
}

interface RecentActivityProps {
    userId: string;
}

export function RecentActivity({ userId }: RecentActivityProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
            const res = await api.get(`/wallet/transactions/${userId}`);
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchTransactions();
        // Optional: Poll every 10 seconds to keep list fresh
        const interval = setInterval(fetchTransactions, 10000);
        return () => clearInterval(interval);
    }, [fetchTransactions]);

    return (
        <div className="space-y-4">
            {loading && transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading activity...</div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-slate-900 rounded-xl border border-slate-800">
                    <p>No recent activity</p>
                </div>
            ) : (
                transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w - 10 h - 10 rounded - full flex items - center justify - center ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-500' :
                                tx.type === 'BUY' ? 'bg-indigo-500/10 text-indigo-500' :
                                    'bg-rose-500/10 text-rose-500'
                                } `}>
                                <span className="text-xs font-bold">{tx.type[0]}</span>
                            </div>
                            <div>
                                <p className="text-white font-medium">{tx.type === 'BUY' ? 'Bought USDT' : tx.type === 'SELL' ? 'Sold USDT' : 'Deposit'}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className={`font - mono font - bold ${tx.sign === '+' ? 'text-emerald-400' : 'text-white'} `}>
                                {tx.sign}{Number(tx.amount).toFixed(2)} {tx.currency}
                            </p>
                            <div className="flex items-center justify-end text-xs text-emerald-500 mt-1">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                <span>Completed</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

}
