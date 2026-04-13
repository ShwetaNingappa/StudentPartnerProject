import User from "../models/User.js";
import bcrypt from "bcryptjs";

const dummyStudents = [
  { name: "Rahul_CSE", email: "rahul_cse@dummy.local", totalQuizScore: 1500 },
  { name: "Sneha_Placements", email: "sneha_placements@dummy.local", totalQuizScore: 1450 },
  { name: "Vikram_Tech", email: "vikram_tech@dummy.local", totalQuizScore: 1390 },
  { name: "Ananya_CodePrep", email: "ananya_codeprep@dummy.local", totalQuizScore: 1330 },
  { name: "Karthik_Apti", email: "karthik_apti@dummy.local", totalQuizScore: 1280 },
  { name: "Meera_Logical", email: "meera_logical@dummy.local", totalQuizScore: 1225 },
  { name: "Priya_Quant", email: "priya_quant@dummy.local", totalQuizScore: 1160 },
  { name: "Arjun_Planner", email: "arjun_planner@dummy.local", totalQuizScore: 1095 },
  { name: "Neha_Interview", email: "neha_interview@dummy.local", totalQuizScore: 960 },
  { name: "Rohit_Practice", email: "rohit_practice@dummy.local", totalQuizScore: 820 }
];

export const ensureDummyLeaderboard = async () => {
  const password = await bcrypt.hash("dummy-password-123", 10);
  await Promise.all(
    dummyStudents.map((student) =>
      User.updateOne(
        { email: student.email },
        {
          $set: {
            name: student.name,
            totalQuizScore: student.totalQuizScore,
            password
          },
          $setOnInsert: {
            categoryPerformance: {
              Quantitative: 0,
              Logical: 0,
              Verbal: 0,
              Technical: 0
            }
          }
        },
        { upsert: true }
      )
    )
  );
};

export const getLeaderboard = async (_req, res) => {
  const users = await User.find().select("name email totalQuizScore").sort({ totalQuizScore: -1 });
  const ranked = users.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    email: user.email,
    totalQuizScore: user.totalQuizScore
  }));

  res.json(ranked);
};
