import { Router } from "express";
import { create, list } from "../controllers/feedback-controllers";

const router = Router();

router.post("/", create);
router.get("/list", list);

export default router;
