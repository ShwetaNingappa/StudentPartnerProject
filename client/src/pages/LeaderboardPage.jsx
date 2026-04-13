import { useEffect, useState } from "react";
import api from "../api";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leaderboard").then((res) => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-56 mb-4" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
      {!users.length ? (
        <EmptyState
          title="Your journey starts here!"
          description="No leaderboard entries yet. Be the first to set the pace."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl glass-card">
          <table className="w-full text-left">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="p-3 text-cyan-300">Rank</th>
                <th className="p-3 text-cyan-300">Name</th>
                <th className="p-3 text-cyan-300">Email</th>
                <th className="p-3 text-cyan-300">Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-t border-cyan-400/20 interactive-item">
                  <td className="p-3">{u.rank}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-amber-300">{u.totalQuizScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
