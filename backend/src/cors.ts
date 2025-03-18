import { Request,Response,NextFunction } from "express";

const ACCEPTED_ORIGINS:string[]=[
    "http://localhost:3000"
];

export function corsHandler(req:Request,res:Response,next:NextFunction){
    const origin = req.header("origin");
    if(!origin || typeof origin === "string" && ACCEPTED_ORIGINS.includes(origin)){
        res.header("Access-Control-Allow-Origin",origin);
        res.header("Access-Control-Allow-Methods","GET,HEAD,POST,PUT,PATCH,DELETE")
        res.header("Access-Control-Allow-Headers","Content-Type, Authorization")
        res.header("Access-Control-Allow-Credentials", "true")
    }
    next();
}
