import mongoose from "mongoose";

const codingQuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    topic: { type: String, required: true },
    link: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("CodingQuestion", codingQuestionSchema);
