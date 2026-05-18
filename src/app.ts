import express from "express";
import cors from "cors";
import feedbackRoute from "./routes/feedback.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/feedbacks", feedbackRoute);

export default app;
