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
    // Note: Ensure your backend route returns 'streak' as 'dailyStreak' to match this state
    api.get("/quiz/dashboard")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
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
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Student Dashboard</h2>
        {stats.dailyStreak > 0 && (
          <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium border border-orange-500/30 animate-pulse">
            Ongoing Streak! 🔥
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
      <div className="glass-card p-5 interactive-item border-l-4 border-cyan-400">
  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Daily Streak</p>
  <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-300">
    {(stats.dailyStreak || 0)} {" "}
    <span className="text-lg font-normal text-slate-400">
      {(stats.dailyStreak || 0) === 1 ? 'day' : 'days'}
    </span>
  </p>
</div>
        
        <div className="glass-card p-5 interactive-item border-l-4 border-amber-400">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Quiz Score</p>
          <p className="text-4xl font-bold text-amber-300">{stats.totalQuizScore}</p>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <p className="mb-6 text-lg font-medium text-white">Preparation Progress</p>
        {!stats.progressChart.length ? (
          <EmptyState
            title="Your journey starts here!"
            description="Take your first quiz to unlock progress analytics."
          />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.progressChart}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid #1f2937', 
                    borderRadius: '8px',
                    color: '#22d3ee' 
                  }}
                  itemStyle={{ color: '#22d3ee' }}
                  cursor={{ stroke: '#1f2937', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#00D2FF" 
                  strokeWidth={4} 
                  dot={{ fill: '#00D2FF', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;