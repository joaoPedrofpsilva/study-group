import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import prisma from "../prisma";

const JWT_SECRET= process.env.JWT_SECRET!

export const authService ={
    async add(email: string , senha:string): Promise<Omit<User, "senha">>{
        const hash = await bcrypt.hash(senha, 12)
        const user = await prisma.user.create({
            data: {email, senha: hash}
        })
        const {senha:_, ...userWithNoPassword} = user
        return userWithNoPassword
    },

    async list(): Promise<any>{
        return prisma.user.findMany()
    },
    async login(email: string, senha: string): Promise<string> {
        const user = await prisma.user.findUnique({where: {email}})

        if(!user) throw new Error("User not found")

        const confirmationPassword = await bcrypt.compare(senha, user.senha)

        if(!confirmationPassword) throw new Error("Password does not match")

        return jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: "1d"})


    }

}