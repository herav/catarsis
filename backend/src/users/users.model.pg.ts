import { DB_USER,DB_HOST,DB_PASSWORD,DB_DATABASE,DB_PORT} from "../config";
import { Pool, PoolClient, QueryResult} from "pg";
import { getUsersQuery,getUserQuery,uuidQuery,postUserQuery,deleteUserQuery, getUserByIDQuery} from "./users.querys";
import { User } from "./user.class";

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: +DB_PORT
})

async function fetchDB(query:string,params:string[]):Promise<QueryResult<any>>{
    let client:PoolClient|undefined
    let queryResult:QueryResult<any>
    try{
        client = await pool.connect()
        queryResult = await client.query(query,params)
        return queryResult
    }
    catch(error){
        console.error("Error en Modelo fetchDB():",error)
        throw error
    }
    finally{
        if(client){client.release()}
    }
}

export class UserModel{

    static async getUsers():Promise<User[]>{
        try{
            const data = await fetchDB(getUsersQuery,[])
            return data.rows as User[]  
        }
        catch(error){
            console.error("Error en Modelo.getUsers()")
            throw error
        }
    } 

    static async getUser(name:string):Promise<User>{
        try{
            const data = await fetchDB(getUserQuery,[name])
            return data.rows[0] as User
        }
        catch(error){
            console.error("Error en Modelo.getUser()")
            throw error
        }
    }

    static async postUser(user:User):Promise<User>{
        try{
            user.id = (await fetchDB(uuidQuery,[])).rows[0].gen_random_uuid
            await fetchDB(postUserQuery,[user.id,user.name,user.email,user.password])
            const newUser = (await fetchDB(getUserQuery,[user.name])).rows[0] as User
            return newUser
        }
        catch(error){
            console.error("Error en Modelo.postUser()")
            throw error
        }     
    }

    static async deleteUser(name:string):Promise<string>{
        try{
            await fetchDB(deleteUserQuery,[name])
            return "User deleted succesfully"
        }
        catch(error){
            console.error("Error en Modelo.deleteUser()")
            throw error
        }
    }

    static async putUser(name:string,data:Record<string,any>):Promise<User>{
        const values:any[] = []
        const clauses:string[]=[]
        let index = 1
        for(const key in data){
            if(data.hasOwnProperty(key)){
                clauses.push(`${key} = $${index}`)
                values.push(data[key])
                index++
            }
        }
        values.push(name)
        const putUserQuery = `UPDATE users SET ${clauses.join(', ')} WHERE name = $${index}`
        try{
            const id = (await fetchDB(getUserQuery,[name])).rows[0].id
            await fetchDB(putUserQuery,values)
            const user = (await fetchDB(getUserByIDQuery,[id])).rows[0] as User
            return user
        }
        catch(error){
            console.error("Error en Modelo.putUser()")
            throw error
        }
    }
}



