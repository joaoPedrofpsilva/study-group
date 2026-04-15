import { CreateFeedbackDTO, FeedBack, UpdateFeedbackDTO } from "../types/feedback";


const feedBacks: FeedBack[] = [];
let nextid = 1;

export const feedbackService ={ 
    create(dto: CreateFeedbackDTO): FeedBack  {
     const feedback: FeedBack = { id: nextid++, ...dto};   
     feedBacks.push(feedback);

     return feedback
   },
   list(): FeedBack[] {
    return feedBacks
   },
   getById(id: number): FeedBack | undefined {
    const feedback = feedBacks.find((f) => f.id === id);
    return feedback;
   },
   update(id: number, dto: UpdateFeedbackDTO): FeedBack | null {
    const feedback = feedBacks.find((f) => f.id === id);
    if (!feedback) {
        return null;
    }
    const index = feedBacks.indexOf(feedback);
    const updatedFeedback = { ...feedback, ...dto };
    feedBacks[index] = updatedFeedback;
    return updatedFeedback;
   },
   delete(id: number): boolean{
    const feedback = feedBacks.find((f) => f.id === id);
    if (!feedback){
        return false;
    }
    const index = feedBacks.indexOf(feedback);
    feedBacks.splice(index, 1);
    return true;
   }
}