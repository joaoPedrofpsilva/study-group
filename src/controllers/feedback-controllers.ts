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

export const listFeedbackById = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);
  const feedback = feedbackService.getById(id);
  if(!feedback){
    res.status(404).json({ message: "Feedback not found" });
    return;
  }
  res.status(200).json(feedback);
}

export const update = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);
  const feedback = feedbackService.update(id, req.body);
  if (!feedback) {
    res.status(404).json({ message: "Feedback not found" });
    return;
  }
  res.status(200).json(feedback);
}

export const deleteFeedback = (req: Request, res: Response): void => {
  const id: number = Number(req.params.id);
  const success = feedbackService.delete(id);
  if (!success) {
    res.status(404).json({ message: "Feedback not found" });
    return;
  }
   res.status(200).json({ message: "Feedback deleted successfully" });
}
