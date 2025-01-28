import { Request,Response,NextFunction } from "express";
import {AnyZodObject,ZodError} from "zod"

export const UserValidation = (schema:AnyZodObject)=>
(req:Request,res:Response,next:NextFunction)=>{
    try{
        const result = schema.parse(req.body)
        console.log("Result:");
        console.log(result);
        next()
    }
    catch(error){
        if(error instanceof ZodError)
            res.status(400).json(error.issues.map(issue=>({error:issue.message})))

    }
}