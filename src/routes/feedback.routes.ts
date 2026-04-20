import { Router } from "express";
import { create, listFeedback, listFeedbackById, update, deleteFeedback } from "../controllers/feedback-controllers";

const router = Router();

router.post("/", create);
router.get("/list", listFeedback);
router.get("/list/:id", listFeedbackById);
router.put("/update/:id", update);
router.delete("/delete/:id", deleteFeedback);

export default router;
