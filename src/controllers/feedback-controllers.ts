import { Request, Response } from "express";
import { feedbackService } from "../services/feedback.service";

export const create = async (req: Request, res: Response): Promise<void> => {
  const feedback = await feedbackService.create(req.body);
  res.status(201).json(feedback);
};

export const list = async (_req: Request, res: Response): Promise<void> => {
  const feedbacks = await feedbackService.list();
  res.json(feedbacks);
};
