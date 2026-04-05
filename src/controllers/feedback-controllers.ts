import { Request, Response } from "express";

interface FeedBack {
  id: number;
  autor: string;
  message: string;
  nota: number;
}
type CreateFeedbackDTO = Omit<FeedBack, "id">;

const feedBacks: FeedBack[] = [];
let nextid = 1;

export const create = (req: Request, res: Response): void => {
  const { autor, message, nota }: CreateFeedbackDTO = req.body;
  const feedback: FeedBack = { id: nextid++, autor, message, nota };

  feedBacks.push(feedback);
  res.status(201).json(feedback);
};
