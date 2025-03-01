import { executeQuery } from "../DB.utils.pg";
import { getUsersQuery,getUserQuery,uuidQuery,postUserQuery,deleteUserQuery, getUserByIDQuery, putUserQuery,getUserIDQuery, getUserEmailQuery} from "./users.querys";
import { User } from "./user.class";
import { catchError } from "../errors.utils";


export class UserModel{

    static async getUsers():Promise<User[]|null>{
        const [error,queryResult] = await catchError(executeQuery(getUsersQuery,[]))
        if(error){
            throw error
        }
        if(typeof queryResult.rowCount === "number"  && queryResult.rowCount>0){
            return queryResult.rows as User[]     
        }
        return null
    } 

    static async getUser(name:string):Promise<User|null>{
        const [error,queryResult] = await catchError(executeQuery(getUserQuery,[name]))
        if(error){
            throw error
        }
        if(typeof queryResult.rowCount === "number"  && queryResult.rowCount===1){
            return queryResult.rows[0] as User 
        }
        return null
    }

    static async postUser(user:User):Promise<User|null>{
        const [emailError, EMAILqueryResult] = await catchError(executeQuery(getUserEmailQuery,[user.email]))
        if(emailError){
            throw emailError
        }
        if(typeof EMAILqueryResult.rowCount === "number" && EMAILqueryResult.rowCount === 1){
            return null;
        }

        const [UUIDerror,UUIDqueryResult] = await catchError(executeQuery(uuidQuery,[]))
        if(UUIDerror){
            throw UUIDerror;
        }
        user.id = UUIDqueryResult.rows[0].gen_random_uuid

        const [error,queryResult] = await catchError(executeQuery(postUserQuery,[user.id,user.name,user.email,user.password]))
        if(error){
            throw error;
        }
        if(typeof queryResult.rowCount === "number"  && queryResult.rowCount===1){
            return user;
        }
        return null;
    }

    static async deleteUser(name:string):Promise<boolean>{
        const [error,queryResult] = await catchError(executeQuery(deleteUserQuery,[name]))
        if(error){
            throw error
        }
        if(typeof queryResult.rowCount === "number"  && queryResult.rowCount===1){
            return true
        }
        return false
    }

    static async putUser(name:string,data:Record<string,any>):Promise<User|null>{
        const [UserIDError,UserIDqueryResult] = await catchError(executeQuery(getUserIDQuery,[name]))
        if(UserIDError){
            throw UserIDError
        }
        if(typeof UserIDqueryResult.rowCount === "number" && UserIDqueryResult.rowCount === 0){
            return null;
        }

        const id = UserIDqueryResult.rows[0].id

        const [queryError,queryData] = await catchError(putUserQuery(name, data))
        if(queryError){
            throw queryError
        }
        const {putQuery,values} = queryData

        const [error, queryResult] = await catchError(executeQuery(putQuery,values))
        if(error){
            throw error
        }

        if(typeof queryResult.rowCount === "number"  && queryResult.rowCount===1){
            const[userError,USERqueryResult] = await catchError(executeQuery(getUserByIDQuery,[id]))
            if(userError){
                throw userError
            }
            return USERqueryResult.rows[0] as User
        }
        return null  
    }
}



