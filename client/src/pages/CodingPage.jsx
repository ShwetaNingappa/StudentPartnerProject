import { useEffect, useState } from "react";
import api from "../api";
import Skeleton from "../components/Skeleton";
import { useToast } from "../context/ToastContext";

const CodingPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const { data } = await api.patch(`/coding/${id}/toggle`);
      showToast(data.message, "success");
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
      <div className="grid gap-4">
        {questions.map((q) => (
          <div key={q._id} className="rounded-xl bg-slate-800 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">{q.title}</h3>
              <p className="text-slate-300 text-sm mt-1">
                {q.company} | {q.difficulty} | {q.topic}
              </p>
              <a className="text-indigo-300 text-sm" href={q.link} target="_blank" rel="noreferrer">
                Solve Link
              </a>
            </div>
            <button
              onClick={() => toggleSolved(q._id)}
              className={`mt-3 md:mt-0 rounded-lg px-4 py-2 ${q.solved ? "bg-green-600" : "bg-indigo-600"}`}
            >
              {q.solved ? "Solved" : "Mark Solved"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodingPage;
