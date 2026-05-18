import express from "express";
import cors from "cors";
import feedbackRoute from "./routes/feedback.routes";
import authRoute from "./routes/auth.route"

const app = express();
app.use(cors());
app.use(express.json());
app.use("/feedbacks", feedbackRoute);

app.use("/auth", authRoute)

export default app;
