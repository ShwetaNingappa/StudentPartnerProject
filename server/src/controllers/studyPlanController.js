const topicMap = {
  Quantitative: ["Percentages", "Profit and Loss", "Time and Work"],
  Logical: ["Puzzles", "Seating Arrangement", "Blood Relations"],
  Verbal: ["Reading Comprehension", "Vocabulary", "Grammar"],
  Technical: ["DBMS", "OS", "Computer Networks"]
};

export const getStudyPlan = async (req, res) => {
  const performance = req.user.categoryPerformance;
  const entries = Object.entries(performance);
  entries.sort((a, b) => a[1] - b[1]);

  const weakestCategories = entries.slice(0, 2).map(([name]) => name);

  // Smart logic: prioritize user weakest categories first, then recommend
  // targeted core topics from each category to improve interview readiness.
  const plan = weakestCategories.map((category) => ({
    category,
    recommendedTopics: topicMap[category]
  }));

  const tasks = (req.user.customTasks || []).sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  res.json({ weakestCategories, plan, tasks });
};

export const addTask = async (req, res) => {
  const { text, priority = "Medium" } = req.body;
  if (!text?.trim()) {
    return res.status(400).json({ message: "Task text is required" });
  }
  if (!["Low", "Medium", "High"].includes(priority)) {
    return res.status(400).json({ message: "Priority must be Low, Medium or High" });
  }

  const user = req.user;
  user.customTasks.push({ text: text.trim(), completed: false, priority });
  await user.save();

  return res.status(201).json({ tasks: user.customTasks });
};

export const toggleTask = async (req, res) => {
  const user = req.user;
  const task = user.customTasks.id(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = !task.completed;
  await user.save();

  return res.json({ tasks: user.customTasks });
};

export const deleteTask = async (req, res) => {
  const user = req.user;
  const task = user.customTasks.id(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.deleteOne();
  await user.save();

  return res.json({ tasks: user.customTasks });
};
