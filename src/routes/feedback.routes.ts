import { Router } from "express";
import { create } from "../controllers/feedback-controllers";

const router = Router();

router.post("/", create);

export default router;
