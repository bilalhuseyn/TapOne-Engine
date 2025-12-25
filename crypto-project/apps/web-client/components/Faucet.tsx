"use client";

import { useState } from 'react';
import api from '../lib/api';
import { Loader2 } from 'lucide-react';

interface FaucetProps {
    userId: string;
    onSuccess: () => void;
}

export function Faucet({ userId, onSuccess }: FaucetProps) {
    const [loading, setLoading] = useState(false);

    const deposit = async (currency: 'AZN' | 'USDT', amount: number) => {
        setLoading(true);
        try {
            await api.post('/wallet/faucet', { userId, currency, amount });
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Deposit failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Faucet</h3>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => deposit('AZN', 100)}
                    disabled={loading}
                    className="flex items-center justify-center rounded-xl bg-emerald-500/10 px-4 py-4 text-sm font-bold text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    +100 AZN
                </button>
                <button
                    onClick={() => deposit('USDT', 1000)}
                    disabled={loading}
                    className="flex items-center justify-center rounded-xl bg-blue-500/10 px-4 py-4 text-sm font-bold text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all hover:scale-[1.02]"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    +1000 USDT
                </button>
            </div>
        </div>
    );
}
