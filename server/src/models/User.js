import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordOTP: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    totalQuizScore: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    solvedCodingQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "CodingQuestion" }],
    customTasks: [
      {
        text: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }
      }
    ],
    categoryPerformance: {
      Quantitative: { type: Number, default: 0 },
      Logical: { type: Number, default: 0 },
      Verbal: { type: Number, default: 0 },
      Technical: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
