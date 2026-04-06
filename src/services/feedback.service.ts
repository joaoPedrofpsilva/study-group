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
   }
}