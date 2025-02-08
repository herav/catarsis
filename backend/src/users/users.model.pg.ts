import { executeQuery } from "../DB.utils.pg";
import { getUsersQuery,getUserQuery,uuidQuery,postUserQuery,deleteUserQuery, getUserByIDQuery} from "./users.querys";
import { User } from "./user.class";


export class UserModel{

    static async getUsers():Promise<User[]>{
        try{
            const data = await executeQuery(getUsersQuery,[])
            return data.rows as User[]  
        }
        catch(error){
            console.error("Error en Modelo.getUsers()")
            throw error
        }
    } 

    static async getUser(name:string):Promise<User>{
        try{
            const data = await executeQuery(getUserQuery,[name])
            return data.rows[0] as User
        }
        catch(error){
            console.error("Error en Modelo.getUser()")
            throw error
        }
    }

    static async postUser(user:User):Promise<User>{
        try{
            user.id = (await executeQuery(uuidQuery,[])).rows[0].gen_random_uuid
            await executeQuery(postUserQuery,[user.id,user.name,user.email,user.password])
            const newUser = (await executeQuery(getUserQuery,[user.name])).rows[0] as User
            return newUser
        }
        catch(error){
            console.error("Error en Modelo.postUser()")
            throw error
        }     
    }

    static async deleteUser(name:string):Promise<string>{
        try{
            await executeQuery(deleteUserQuery,[name])
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
            const id = (await executeQuery(getUserQuery,[name])).rows[0].id
            await executeQuery(putUserQuery,values)
            const user = (await executeQuery(getUserByIDQuery,[id])).rows[0] as User
            return user
        }
        catch(error){
            console.error("Error en Modelo.putUser()")
            throw error
        }
    }
}



