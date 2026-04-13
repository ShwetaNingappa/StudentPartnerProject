import CodingQuestion from "../models/CodingQuestion.js";
import User from "../models/User.js";
import { codingQuestionsSeed } from "../data/codingQuestions.js";

export const ensureCodingSeed = async () => {
  const existing = await CodingQuestion.countDocuments();
  if (!existing) await CodingQuestion.insertMany(codingQuestionsSeed);
};

export const getCodingQuestions = async (req, res) => {
  const questions = await CodingQuestion.find().sort({ company: 1, difficulty: 1 });
  const solvedSet = new Set(req.user.solvedCodingQuestions.map((id) => id.toString()));

  const response = questions.map((q) => ({
    ...q.toObject(),
    solved: solvedSet.has(q._id.toString())
  }));

  res.json(response);
};

export const toggleSolved = async (req, res) => {
  const { questionId } = req.params;
  const user = await User.findById(req.user._id);
  const solvedIds = user.solvedCodingQuestions.map((id) => id.toString());
  const exists = solvedIds.includes(questionId);

  if (exists) {
    user.solvedCodingQuestions = user.solvedCodingQuestions.filter((id) => id.toString() !== questionId);
  } else {
    user.solvedCodingQuestions = [...user.solvedCodingQuestions, questionId];
    // Successful DSA test-case pass: award 50 score points.
    user.totalScore = (user.totalScore || 0) + 50;
  }

  await user.save();
  res.json({
    message: exists ? "Marked as unsolved" : "Marked as solved",
    totalScore: user.totalScore || 0
  });
};
