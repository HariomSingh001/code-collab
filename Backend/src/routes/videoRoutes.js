import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createOrGetRoom } from "../controllers/videoController.js";

const router = express.Router();

router.post("/room", protectRoute, createOrGetRoom);

export default router;
