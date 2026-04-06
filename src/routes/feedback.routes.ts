import { Router } from "express";
import { create, listFeedback } from "../controllers/feedback-controllers";

const router = Router();

router.post("/", create);
router.get("/list", listFeedback);



export default router;
