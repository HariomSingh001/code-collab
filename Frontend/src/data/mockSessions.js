// Mock data for local development until backend is wired up
export const mockActiveSessions = [
  {
    _id: "a1",
    problem: "Two Sum",
    difficulty: "easy",
    host: { clerkId: "u1", name: "Alex" },
    participant: { clerkId: "u2", name: "Jordan" },
    participantCount: 2,
  },
  {
    _id: "a2",
    problem: "LRU Cache",
    difficulty: "hard",
    host: { clerkId: "u3", name: "Priya" },
    participant: null,
    participantCount: 1,
  },
];

export const mockRecentSessions = [
  {
    _id: "r1",
    problem: "Valid Parentheses",
    difficulty: "easy",
    host: { name: "You" },
    participant: { name: "Jordan" },
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    _id: "r2",
    problem: "Merge Intervals",
    difficulty: "medium",
    host: { name: "You" },
    participant: { name: "Priya" },
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    _id: "r3",
    problem: "Word Break",
    difficulty: "hard",
    host: { name: "You" },
    participant: null,
    status: "abandoned",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];
