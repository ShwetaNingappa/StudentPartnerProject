import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import api from "../api";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import SuccessModal from "../components/SuccessModal";
import { useToast } from "../context/ToastContext";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api.get("/quiz/questions").then((res) => setQuestions(res.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  useEffect(() => {
    if (timeLeft === 0 && !result) submitQuiz();
  }, [timeLeft, result]);

  const submitQuiz = async () => {
    if (submitting) return;
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0 && !result) {
      const confirmed = window.confirm(
        `You still have ${unansweredCount} unanswered question(s). Submit anyway?`
      );
      if (!confirmed) {
        showToast("Complete more questions before submitting", "info");
        return;
      }
    }

    try {
      setSubmitting(true);
      const { data } = await api.post("/quiz/submit", { answers });
      setResult(data);
      showToast("Quiz submitted successfully", "success");
      if (data.streakMaintained) {
        confetti({
          particleCount: 280,
          spread: 150,
          startVelocity: 60,
          ticks: 320,
          origin: { x: 0.5, y: 0.5 }
        });
        setShowSuccessModal(true);
      }
    } catch {
      showToast("Quiz submission failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-56 mb-4" />
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-52 mb-4" />
      </div>
    );
  }

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const progress = total ? Math.round((answered / total) * 100) : 0;
  const currentQuestion = questions[currentIndex];

  return (
    <div>
      <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <h2 className="text-2xl font-semibold mb-4">Aptitude Quiz</h2>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-indigo-300">Time Left: {formatTime(Math.max(timeLeft, 0))}</p>
        <p className="text-slate-300 text-sm">
          Answered: {answered}/{total}
        </p>
      </div>
      <div className="mb-6 h-2 w-full rounded-full bg-slate-700">
        <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
      </div>
      {!result && !questions.length && (
        <EmptyState
          title="Your journey starts here!"
          description="Fresh questions will appear here once the quiz bank is available."
        />
      )}
      {!result && currentQuestion && (
        <>
          <div className="glass-card p-4">
            <p className="text-sm text-slate-300">
              Question {currentIndex + 1} of {total} | {currentQuestion.category}
            </p>
            <p className="font-medium mt-2">{currentQuestion.question}</p>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {currentQuestion.options.map((opt) => (
                <label
                  key={opt}
                  className={`rounded-md border px-3 py-2 cursor-pointer ${
                    answers[currentQuestion.id] === opt
                      ? "border-cyan-400 bg-cyan-500/20"
                      : "border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    className="mr-2"
                    checked={answers[currentQuestion.id] === opt}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: opt
                      }))
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="interactive-item rounded-lg border border-cyan-400/35 px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(total - 1, prev + 1))}
              disabled={currentIndex === total - 1}
              className="pro-btn rounded-lg px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 w-9 rounded-md text-sm ${
                  currentIndex === idx
                    ? "bg-cyan-500 text-[#09141b]"
                    : answers[q.id]
                      ? "bg-amber-400 text-[#161004]"
                      : "bg-slate-700"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {!result ? (
        <button
          onClick={submitQuiz}
          disabled={submitting}
          className="pro-btn mt-6 rounded-lg px-5 py-3 font-medium disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      ) : (
        <div className="glass-card mt-6 p-4">
          <p className="text-lg">Score: {result.score}</p>
          <p className="text-slate-300">Total Questions: {result.totalQuestions}</p>
          <p className="text-amber-300">Streak: {result.dailyStreak} day(s)</p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
