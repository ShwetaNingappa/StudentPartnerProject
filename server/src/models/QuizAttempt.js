import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    categoryScores: {
      Quantitative: { type: Number, default: 0 },
      Logical: { type: Number, default: 0 },
      Verbal: { type: Number, default: 0 },
      Technical: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);
