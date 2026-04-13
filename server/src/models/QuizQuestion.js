import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: ["Quantitative", "Logical", "Verbal", "Technical"] },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("QuizQuestion", quizQuestionSchema);
