"use client";

import Link from 'next/link';
import { AdminProfit } from '../../components/AdminProfit';
import { ArrowLeft } from 'lucide-react';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="flex items-center space-x-4 mb-8">
                    <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Dashboard</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Admin Treasury</h1>
                </header>

                <AdminProfit />
            </div>
        </div>
    );
}
