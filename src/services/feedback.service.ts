import prisma from "../prisma";
import { CreateFeedbackDTO, Feedback } from "../types/feedback";

export const feedbackService = {
  async create(dto: CreateFeedbackDTO): Promise<Feedback> {
    return prisma.feedback.create({ data: dto });
  },

  async list(): Promise<Feedback[]> {
    return prisma.feedback.findMany();
  },
};