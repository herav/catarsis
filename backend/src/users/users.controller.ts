import { Request,Response } from "express"
import { UserModel } from "./users.model.pg"
import { validatePartialUser, validateUser } from "./users.schema"
import { catchError } from "../errors.utils"

export const getUsers = async (_req:Request,res:Response):Promise<void> => {
    const [error,users] = await catchError(UserModel.getUsers());
    if(error  || users === undefined){
        if(error){console.error(error);}
        else {console.error(new Error("users is undefined"));}
        res.status(500).json({message:"Internal Error."});
        return;
    }
    if(users === null){
        res.status(404).json({message:"No users found."});
        return;
    }
    res.status(200).json(users);
}

export const getUser = async (req:Request,res:Response): Promise<void> => {
    const {name} = req.params;
    const [error,user] = await catchError(UserModel.getUser(name));
    if(error || user === undefined){
        if(error){console.error(error);}
        else {console.error(new Error("user is undefined"));}
        res.status(500).json({message:"Internal Error."});
        return;
    }
    if(user === null){
        res.status(404).json({message:"User not found"});
        return;
    }
    res.status(200).json(user);
}

export const postUser = async (req:Request,res:Response): Promise<void> => {
    const resultValidation = validateUser(req.body);
    if(resultValidation.success){
        const [error,user] = await catchError(UserModel.postUser({...resultValidation.data,id:""}));
        if(error||user === undefined){
            if(error){console.error(error);}
            else {console.error(new Error("user is undefined"));}
            res.status(500).json({message:"Internal Error."});
            return;
        }
        if(user === null){
            res.status(500).json({message:"Impossible to save User"});
            return;
        }
        res.status(200).json(user);
    }
    else{
        res.status(400).json({error:JSON.parse(resultValidation.error.message)});  
    }
} 

export const deleteUser = async (req:Request,res:Response): Promise<void> => {
    const {name} = req.params;
    const [error,status] = await catchError(UserModel.deleteUser(name));
    if(error||status === undefined){
        if(error){console.error(error);}
        else {console.error(new Error("Delete status is undefined"));}
        res.status(500).json({message:"Internal Error."});
        return;
    }
    if(status){
        res.status(200).json({message:"User deleted"});
    }
    else{
        res.status(400).json({message:"Impossible to delete User"});
    }
    
}

export const putUser = async (req:Request,res:Response): Promise<void> => {
    const {name} = req.params;
    const resultValidation = validatePartialUser(req.body);
    if(resultValidation.success){
        const [error,user] = await catchError(UserModel.putUser(name,resultValidation.data));
        if(error||user === undefined){
            if(error){console.error(error);}
            else {console.error(new Error("user is undefined"));}
            res.status(500).json({message:"Internal Error."});
            return;
        }
        if(user === null){
            res.status(500).json({message:"Impossible to update User"});
            return;
        }
        res.status(200).json(user);
    }
    else{res.status(400).json({error:JSON.parse(resultValidation.error.message)});}
}

