import express from "express";
import feedbackRoute from "./routes/feedback.routes";
const app = express();
app.use(express.json());
app.use("/", feedbackRoute);
export default app;
