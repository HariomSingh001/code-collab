import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: String, required: true },
    description: {
      text: { type: String, required: true },
      notes: [String],
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: [String],
    starterCode: {
      javascript: String,
      python: String,
      java: String,
    },
    expectedOutput: {
      javascript: String,
      python: String,
      java: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);
