import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import SuccessModal from "../components/SuccessModal";

const DashboardPage = () => {
  const [stats, setStats] = useState({ dailyStreak: 0, totalQuizScore: 0, progressChart: [] });
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    api.get("/quiz/dashboard").then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && stats.dailyStreak >= 5) {
      confetti({
        particleCount: 320,
        spread: 160,
        startVelocity: 62,
        ticks: 340,
        origin: { x: 0.5, y: 0.5 }
      });
      setShowSuccessModal(true);
    }
  }, [loading, stats.dailyStreak]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <h2 className="text-2xl font-semibold">Student Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-5 interactive-item">
          <p className="text-slate-300">Daily Streak</p>
          <p className="text-3xl font-bold text-cyan-300">{stats.dailyStreak} days</p>
        </div>
        <div className="glass-card p-5 interactive-item">
          <p className="text-slate-300">Total Quiz Score</p>
          <p className="text-3xl font-bold text-amber-300">{stats.totalQuizScore}</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <p className="mb-4 text-lg font-medium">Preparation Progress</p>
        {!stats.progressChart.length ? (
          <EmptyState
            title="Your journey starts here!"
            description="Take your first quiz to unlock progress analytics."
          />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.progressChart}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#00D2FF" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
