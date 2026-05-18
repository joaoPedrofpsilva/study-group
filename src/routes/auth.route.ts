import { Router } from "express";
import { list, login, register } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.get("/list", list);
router.post("/login", login);


export default router;
