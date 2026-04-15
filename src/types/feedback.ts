export interface FeedBack {
  id: number;
  autor: string;
  message: string;
  nota: number;
}
export type CreateFeedbackDTO = Omit<FeedBack, "id">;
export type UpdateFeedbackDTO = Partial<Omit<CreateFeedbackDTO, "autor">>;