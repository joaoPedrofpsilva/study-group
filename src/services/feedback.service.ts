import { CreateFeedbackDTO, FeedBack } from "../types/feedback";


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
   getById(id: number): FeedBack | null {
    const feedback = feedBacks.find((f) => f.id === id);
    if (!feedback) {
        return null;
    }
    return feedback;
   },
   update(id: number, dto: Partial<CreateFeedbackDTO>): FeedBack | null {
    const feedback = feedBacks.find((f) => f.id === id);
    if (!feedback) {
        return null;
    }
    const index = feedBacks.indexOf(feedback);
    const updatedFeedback = { ...feedback, ...dto };
    feedBacks[index] = updatedFeedback;
    return updatedFeedback;
   },
   delete(id: number): number{
    const feedback = feedBacks.find((f) => f.id === id);
    if (!feedback){
        return -1;
    }
    const index = feedBacks.indexOf(feedback);
    feedBacks.splice(index, 1);
    return 1;
   }
}