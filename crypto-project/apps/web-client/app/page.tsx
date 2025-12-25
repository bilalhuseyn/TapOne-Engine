"use client";

import { useState } from 'react';
import { Login } from '../components/Login';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  if (!userId) {
    return <Login onLogin={setUserId} />;
  }

  return <Dashboard userId={userId} onLogout={() => setUserId(null)} />;
}
