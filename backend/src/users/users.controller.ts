import { Request,Response } from "express"
import { pool, testConnection } from "../DB"

testConnection(pool)

export const getUsers = async (_req:Request,res:Response) => {
    res.send("All Users")
}

export const getUser = async (_req:Request,res:Response) => {
    res.send("User ID")
}

export const postUser = async (_req:Request,res:Response) => {
    res.send("Post User")
} 

export const putUser = async (_req:Request,res:Response) => {
    res.send("Put User")
}

export const deleteUser = async (_req:Request,res:Response) => {
    res.send("Delete User")
}