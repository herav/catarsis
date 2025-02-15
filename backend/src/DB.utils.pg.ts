import { DB_USER,DB_HOST,DB_PASSWORD,DB_DATABASE,DB_PORT} from "./config";
import { Pool, PoolClient, QueryResult} from "pg";

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: +DB_PORT
})

export async function executeQuery(query:string,params:string[]):Promise<QueryResult<any>>{
    let client:PoolClient|undefined
    let queryResult:QueryResult<any>
    try{
        client = await pool.connect()
        queryResult = await client.query(query,params)
        return queryResult
    }
    catch(error){
        console.error("Error en DB.utils.pg.ts executeQuery():",error)
        throw error
    }
    finally{
        if(client){client.release()}
    }
}