import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const register = async (req: Request, res:Response): Promise<void> =>{
    const {senha, email} = req.body
    const addUser = await authService.add(email, senha)
    res.status(201).json(addUser)
}
export const list = async (req: Request, res:Response): Promise<void> =>{
  const users = await authService.list()
  res.json(users)
}

export const login = async (req: Request, res:Response): Promise<void> => {
try {
    
    const {senha, email} = req.body
    const token = await authService.login(email, senha);
    res.json({token})
} catch (error) {
    res.status(401).json({error: "Invalid Credentials"})
}
}