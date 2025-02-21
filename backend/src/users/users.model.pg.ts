import { executeQuery } from "../DB.utils.pg";
import { getUsersQuery,getUserQuery,uuidQuery,postUserQuery,deleteUserQuery, getUserByIDQuery, putUserQuery} from "./users.querys";
import { User } from "./user.class";
import { catchError } from "../errors.utils";


export class UserModel{

    static async getUsers():Promise<User[]>{
        const [error,data] = await catchError(executeQuery(getUsersQuery,[]))
        if(error){
            throw error
        }
        return data.rows as User[]
    } 

    static async getUser(name:string):Promise<User>{
        const [error,data] = await catchError(executeQuery(getUserQuery,[name]))
        if(error){
            throw error
        }
        return data.rows[0] as User
    }

    static async postUser(user:User):Promise<User>{
        const [IDerror,IDdata] = await catchError(executeQuery(uuidQuery,[]))
        if(IDerror){
            throw IDerror
        }
        const id = IDdata.rows[0].gen_random_uuid

        const [error,_data] = await catchError(executeQuery(postUserQuery,[id,user.name,user.email,user.password]))
        if(error){
            throw error
        }

        const [userError,userData] = await catchError(executeQuery(getUserQuery,[user.name]))
        if(userError){
            throw userError
        }
        return userData.rows[0] as User    
    }

    static async deleteUser(name:string):Promise<string>{
        const [error,_data] = await catchError(executeQuery(deleteUserQuery,[name]))
        if(error){
            throw error
        }
        return "User deleted succesfully"
    }

    static async putUser(name:string,data:Record<string,any>):Promise<User>{
        const [errorID,dataID] = await catchError(executeQuery(getUserQuery,[name]))
        if(errorID){
            throw errorID
        }
        const id = dataID.rows[0].id

        const [queryError,queryData] = await catchError(putUserQuery(name, data))
        if(queryError){
            throw queryError
        }
        const {putQuery,values} = queryData

        const [putError, _putData] = await catchError(executeQuery(putQuery,values))
        if(putError){
            throw putError
        }

        const[userError,userData] = await catchError(executeQuery(getUserByIDQuery,[id]))
        if(userError){
            throw userError
        }
        return userData.rows[0] as User
    }
}



