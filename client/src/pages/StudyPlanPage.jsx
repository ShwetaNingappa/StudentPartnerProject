import { useEffect, useState } from "react";
import api from "../api";
import Skeleton from "../components/Skeleton";

const quotes = [
  "The best way to predict the future is to code it. 💻",
  "Your 6th-semester hustle determines your 8th-semester success. 🚀",
  "Consistency beats talent when talent doesn't stay consistent. 🏆",
  "Every bug you fix today is one less doubt in tomorrow's interview.",
  "Small daily wins build placement-ready confidence.",
  "Practice questions are just interviews in rehearsal mode.",
  "Discipline turns average students into top coders.",
  "One focused hour now can save one stressful week later.",
  "Your resume speaks, but your skills close the offer.",
  "Hard work compounds, especially in coding.",
  "The grind is temporary, the result is career-changing.",
  "Debugging patience is interview superpower.",
  "Keep showing up, even when motivation is low.",
  "A consistent planner beats last-minute panic.",
  "Build projects like your future depends on it, because it does.",
  "You do not need perfect; you need progress.",
  "Learn deeply, revise smartly, execute confidently.",
  "Placement season rewards prepared minds.",
  "Turn pressure into preparation, and preparation into offers.",
  "The version of you who gets selected starts with today's effort."
];

const priorityBadge = {
  High: "bg-amber-300/20 text-amber-800 border-amber-500/60",
  Medium: "bg-indigo-300/20 text-indigo-900 border-indigo-500/60",
  Low: "bg-emerald-300/20 text-emerald-900 border-emerald-500/60"
};

const StudyPlanPage = () => {
  const [data, setData] = useState({ weakestCategories: [], plan: [], tasks: [] });
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(true);
  const quoteOfTheDay =
    quotes[Math.floor(new Date().setHours(0, 0, 0, 0) / (1000 * 60 * 60 * 24)) % quotes.length];

  useEffect(() => {
    api.get("/study-plan").then((res) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const { data: response } = await api.post("/study-plan/tasks", {
      text: newTask,
      priority
    });
    setData((prev) => ({ ...prev, tasks: response.tasks }));
    setNewTask("");
    setPriority("Medium");
  };

  const toggleTask = async (id) => {
    const { data: response } = await api.patch(`/study-plan/tasks/${id}`);
    setData((prev) => ({ ...prev, tasks: response.tasks }));
  };

  const removeTask = async (id) => {
    const { data: response } = await api.delete(`/study-plan/tasks/${id}`);
    setData((prev) => ({ ...prev, tasks: response.tasks }));
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-5 w-96 mb-6" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 md:p-8"
      style={{
        backgroundColor: "#F8F9FA",
        color: "#1A2238",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
      }}
    >
      <h2
        className="text-3xl font-semibold mb-3"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        My Study Plan
      </h2>
      <p className="mb-6 text-slate-700">
        Focus areas: {data.weakestCategories.join(", ") || "Take a quiz to generate recommendations"}
      </p>
      <div className="mb-6 rounded-xl p-4 border" style={{ backgroundColor: "#1A2238", color: "#F8F9FA" }}>
        <p className="text-sm uppercase tracking-widest text-amber-300">Quote of the Day</p>
        <p className="mt-2 text-lg">{quoteOfTheDay}</p>
      </div>

      <div className="mb-8 rounded-xl p-4 border" style={{ backgroundColor: "#1A2238", color: "#F8F9FA" }}>
        <h3 className="text-xl mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Add a new placement goal
        </h3>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="e.g., Solve 15 aptitude questions before lunch"
            className="flex-1 rounded-lg px-3 py-2 text-slate-900"
            style={{ transition: "all 0.3s ease" }}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg px-3 py-2 text-slate-900"
            style={{ transition: "all 0.3s ease" }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            onClick={addTask}
            className="rounded-lg px-4 py-2 font-medium bg-amber-300 text-slate-900 hover:bg-amber-200"
            style={{ transition: "all 0.3s ease" }}
          >
            Add Goal
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {data.tasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center justify-between rounded-lg p-3 bg-slate-100 border border-slate-300"
              style={{ transition: "all 0.3s ease" }}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task._id)} />
                <span className={task.completed ? "line-through text-slate-500" : "text-slate-900"}>
                  {task.text}
                </span>
                <span className={`text-xs rounded-full border px-2 py-0.5 ${priorityBadge[task.priority]}`}>
                  {task.priority}
                </span>
              </label>
              <button
                onClick={() => removeTask(task._id)}
                className="text-sm text-rose-700 hover:text-rose-600"
                style={{ transition: "all 0.3s ease" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {data.plan.map((item) => (
          <div
            key={item.category}
            className="rounded-xl p-4 border border-slate-200"
            style={{ backgroundColor: "#1A2238", color: "#F8F9FA" }}
          >
            <h3 className="font-semibold text-amber-300">{item.category}</h3>
            <ul className="mt-2 space-y-1 text-slate-100">
              {item.recommendedTopics.map((topic) => (
                <li key={topic}>- {topic}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanPage;
