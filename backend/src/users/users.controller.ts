import { Request,Response } from "express"
import { UserModel } from "./users.model.pg"
import { validatePartialUser, validateUser } from "./users.schema"

export const getUsers = async (_req:Request,res:Response) => {
    try{
        const users = await UserModel.getUsers()
        res.send(users)
    }
    catch(error){
        console.error("Error en Controlador.getUsers()");
    }
}

export const getUser = async (req:Request,res:Response) => {
    const {name} = req.params
    try{
        const user = await UserModel.getUser(name)
        res.send(user)
    }
    catch(error){
        console.error("Error en Controlador.getUsers()");
    }
}

export const postUser = async (req:Request,res:Response) => {
    const resultValidation = validateUser(req.body)
    if (resultValidation.success){
        try{
            const user = await UserModel.postUser({...resultValidation.data,id:""})
            res.send(user)
        }
        catch(error){
            console.error("Error en Controlador.postUsers()");
        }
    }
    else{res.status(400).json({error:JSON.parse(resultValidation.error.message)});}
    
} 

export const deleteUser = async (req:Request,res:Response) => {
    const {name} = req.params
    try{
        const status = await UserModel.deleteUser(name)
        res.send(status)
    }
    catch(error){
        console.error("Error en controlador Controller.deleteUser()")
    }
}

export const putUser = async (req:Request,res:Response) => {
    const {name} = req.params
    const resultValidation = validatePartialUser(req.body)
    if(resultValidation.success){
        try{
            const user = await UserModel.putUser(name,resultValidation.data)
            res.send(user)
        }
        catch(error){
            console.error("Error en Controlador.putUsers()");
        }
    }
    else{res.status(400).json({error:JSON.parse(resultValidation.error.message)});}
}

