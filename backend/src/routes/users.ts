import express from "express";
import auth from "../middleware/auth";
import dotenv from "dotenv";
import { getUserProfile, login, register } from "../controllers/users";

dotenv.config();

const router = express.Router();

// Register User
router.post("/register", register);

// User Login
router.post("/login", login);

//Get User Profile
router.get("/:userId", auth, getUserProfile);

export default router;