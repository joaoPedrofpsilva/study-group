export interface Feedback {
  id: number;
  autor: string;
  mensagem: string;
  nota: number;
}
export type CreateFeedbackDTO = Omit<Feedback, "id">;