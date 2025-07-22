"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerification } from '../context/VerificationContext';
import { gsap } from 'gsap';

export default function Dashboard() {
  const router = useRouter();
  const { verified } = useVerification();

  useEffect(() => {
    // If the context hasn't loaded or the user is not verified, redirect.
    // We add a small delay to prevent a flash of content if the context is loading.
    const timer = setTimeout(() => {
      if (!verified) {
        router.push('/');
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, [verified, router]);

  useEffect(() => {
    // Animate the card on load
    gsap.fromTo(".glass-card", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });
  }, []);

  // While waiting for the check, you can show a loader or nothing
  if (!verified) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
      <main className="w-full max-w-4xl p-8 space-y-6 rounded-2xl glass-card">
        <h1 className="text-4xl font-bold text-center">Dashboard</h1>
        <p className="text-center text-gray-300">Welcome, verified human!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="p-6 rounded-lg bg-white/10">
            <h2 className="text-2xl font-bold">Keyword Analysis Tool</h2>
            <p className="mt-2 text-gray-300">Enter a keyword to get started.</p>
            <input type="text" className="w-full p-2 mt-4 text-black rounded-md" placeholder="e.g., 'best SEO practices'" />
          </div>
          <div className="p-6 rounded-lg bg-white/10">
            <h2 className="text-2xl font-bold">Exclusive Content</h2>
            <p className="mt-2 text-gray-300">Read our latest SEO strategies for 2025.</p>
            <button className="w-full px-4 py-3 mt-4 font-bold text-black bg-white rounded-lg hover:bg-gray-200 transition-colors duration-300">
              Read Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}