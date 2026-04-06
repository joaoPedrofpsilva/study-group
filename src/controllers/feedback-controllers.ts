import { Request, Response } from "express";
import { feedbackService } from "../services/feedback.service";




export const create = (req: Request, res: Response): void => {
  console.log(req.body)
const feedback= feedbackService.create(req.body)

res.status(201).json(feedback);
};

export const listFeedback = (_req: Request, res: Response) :void =>{
  res.json(feedbackService.list())
}
//getById
//Update
//delete