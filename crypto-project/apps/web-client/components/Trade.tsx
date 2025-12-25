"use client";

import { useState } from 'react';
import api from '../lib/api';
import { Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { clsx } from 'clsx';

interface TradeProps {
    userId: string;
    onSuccess: () => void;
    currentPrice: number;
    availUsdt: number;
    availAzn: number;
}

export function Trade({ userId, onSuccess, currentPrice, availUsdt, availAzn }: TradeProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Calculate estimated total
    const estimatedTotal = amount ? (parseFloat(amount) * currentPrice).toFixed(2) : '0.00';

    const executeTrade = async (type: 'BUY' | 'SELL') => {
        if (!amount) return;
        setLoading(true);
        try {
            const endpoint = type === 'BUY' ? '/trade/buy' : '/trade/sell';
            await api.post(endpoint, { userId, amount: parseFloat(amount) });
            onSuccess();
            setAmount('');
        } catch (err) {
            console.error(err);
            alert('Trade failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Trade</h3>
                    <p className="text-gray-500 text-sm">Instant Execution</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-medium">Live Rate</p>
                    <div className="flex items-center justify-end text-lg font-mono font-bold text-white">
                        1 USDT ≈ {currentPrice.toFixed(4)} AZN
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Input Area */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 transition-colors focus-within:border-indigo-500/50">
                    <div className="flex justify-between mb-2">
                        <label className="text-xs text-gray-400 font-medium">Amount to Trade</label>
                        <span className="text-xs text-gray-500">Balance: {availUsdt.toFixed(2)} USDT</span>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-transparent text-3xl font-bold text-white focus:outline-none placeholder-slate-700 font-mono"
                            placeholder="0.00"
                        />
                        <span className="text-gray-400 font-medium ml-4">USDT</span>
                    </div>
                </div>

                {/* Estimate */}
                <div className="flex justify-between items-center text-sm px-2">
                    <span className="text-gray-500">Estimated Total</span>
                    <span className="text-white font-mono font-bold text-lg">{estimatedTotal} AZN</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => executeTrade('BUY')}
                        disabled={loading || !amount}
                        className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'BUY'}
                    </button>
                    <button
                        onClick={() => executeTrade('SELL')}
                        disabled={loading || !amount}
                        className="py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'SELL'}
                    </button>
                </div>
            </div>
        </div>
    );
}
