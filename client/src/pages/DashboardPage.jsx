import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api";
import Skeleton from "../components/Skeleton";

const DashboardPage = () => {
  const [stats, setStats] = useState({ dailyStreak: 0, totalQuizScore: 0, progressChart: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/quiz/dashboard").then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

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
      <h2 className="text-2xl font-semibold">Student Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-300">Daily Streak</p>
          <p className="text-3xl font-bold text-indigo-400">{stats.dailyStreak} days</p>
        </div>
        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-300">Total Quiz Score</p>
          <p className="text-3xl font-bold text-indigo-400">{stats.totalQuizScore}</p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-800 p-5">
        <p className="mb-4 text-lg font-medium">Preparation Progress</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.progressChart}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
