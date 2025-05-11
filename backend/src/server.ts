import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usersRoute from "./routes/users";
import studentRoutes from "./routes/student";
import vaccinationRecordRoutes from "./routes/vaccinationRecord";
import vaccinationDriveRoutes from "./routes/vaccinationDrive";
import auth from "./middleware/auth";
import dontenv from "dotenv";

dontenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI as string;

mongoose
  .connect(MONGODB_URI, {
    serverApi: {
      version: "1",
      deprecationErrors: false,
    },
  })
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.error("Mongo Connection Failed: ", err));

app.get("/healthcheck", async (req, res) => {
  res.send("OK\n");
});

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/students", auth, studentRoutes);
app.use("/api/v1/vaccination-records", auth, vaccinationRecordRoutes);
app.use("/api/v1/vaccination-drives", auth, vaccinationDriveRoutes);
app.use("/api/v1/protected", auth, (req, res) => {
  res.json({
    message: "This is a protected resource",
    userId: req.user?.userId,
    user: req.user?.username,
  });
});

app.listen(process.env.PORT || 3000, async () => {
  console.log("Application Started");
});
