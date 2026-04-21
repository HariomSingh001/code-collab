import { Router } from "express";
import Problem from "../models/Problem.js";

const router = Router();

// GET /api/problems
router.get("/", async (req, res) => {
  try {
    const { difficulty } = req.query;
    const filter = difficulty ? { difficulty } : {};
    const problems = await Problem.find(filter).select("-starterCode -expectedOutput");
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/problems/:id
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findOne({ id: req.params.id });
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
