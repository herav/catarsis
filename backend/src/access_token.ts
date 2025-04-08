import { Request,Response,NextFunction } from "express";
import {JWT_KEY} from "./config"
import jwt from "jsonwebtoken"


export function validateAccessToken(req:Request,res:Response,next:NextFunction){
    const validRoutes = ["/users"];
    const excludedRoutes = ["/users/signup","/users/login"];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];

    const checkvalidRoutes = validRoutes.some(route=>req.path.startsWith(route));
    const checkExcludedRoutes = excludedRoutes.some(route=>req.path===route);
    const checMethod = methods.includes(req.method);

    if(checkvalidRoutes && checMethod && !checkExcludedRoutes){
        console.log(`${req.method}: ${req.url}`)
        const token = req.cookies.access_token;
        if(token){
            try{
                const data = jwt.verify(token,JWT_KEY) as {id:string, email:string,password:string,name:string,iat:number,exp:number} ;
                console.log(data)
                req.url= `/users/${data.name}`
                console.log(req.url);
                next();
            }
            catch(error){
                console.log("Something went wrong with DA TOKEN")
                res.status(401).json({message:"ACCESS TOKEN EXPIRED"}).end();
                return;
            }
        }
        else{
            console.log("NO HAY TOKEN\n")
            res.status(401).json({message:"NO ACCESS TOKEN"}).end();
            return;
        } 
    }
    else{
        console.log("next=>")
        next();
    } 
};



// if(req.params.name === "AUTH"){
//     const access_token = req.cookies.access_token;
//     if(access_token){
//         console.log("Si hay Token")
//         const data = jwt.verify(access_token,JWT_KEY) as {id:string, email:string, password:string, name:string, iat:number, exp: number};
//         console.log(data)
//         name = data.name 
//     }
// }
// else{
//     console.log("NO HAY TOKEN\n")
//     name = req.params.name 
// }