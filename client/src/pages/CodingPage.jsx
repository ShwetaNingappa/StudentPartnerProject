import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import api from "../api";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import SuccessModal from "../components/SuccessModal";
import { useToast } from "../context/ToastContext";

const CodingPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { showToast } = useToast();

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get("/coding");
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const toggleSolved = async (id) => {
    try {
      const current = questions.find((q) => q._id === id);
      const { data } = await api.patch(`/coding/${id}/toggle`);
      if (data?.message) showToast(data.message, "success");
      if (!current?.solved) {
        confetti({
          particleCount: 260,
          spread: 140,
          startVelocity: 55,
          ticks: 300,
          origin: { x: 0.5, y: 0.5 }
        });
        setShowSuccessModal(true);
      }
      fetchQuestions();
    } catch {
      showToast("Failed to update question status", "error");
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-72 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Coding Question Dashboard</h2>
      <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      {!questions.length ? (
        <EmptyState
          title="Your journey starts here!"
          description="No coding tasks yet. Start with one problem and build your streak."
        />
      ) : (
        <div className="grid gap-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="glass-card interactive-item p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-semibold">{q.title}</h3>
                <p className="text-slate-300 text-sm mt-1">
                  {q.company} | {q.difficulty} | {q.topic}
                </p>
                <a className="text-cyan-300 text-sm" href={q.link} target="_blank" rel="noreferrer">
                  Solve Link
                </a>
              </div>
              <button
                onClick={() => toggleSolved(q._id)}
                className={`mt-3 md:mt-0 rounded-lg px-4 py-2 interactive-item ${q.solved ? "gold-btn" : "pro-btn"}`}
              >
                {q.solved ? "Solved" : "Mark Solved"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodingPage;
