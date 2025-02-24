import { DB_USER,DB_HOST,DB_PASSWORD,DB_DATABASE,DB_PORT} from "./config";
import { Pool, QueryResult,QueryResultRow} from "pg";
import { catchError } from "./errors.utils";
import { DataBaseConnectionError,QueryExecutionError } from "./errors.utils";

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: +DB_PORT
})

type pgParam = string | number | boolean | Date

export async function executeQuery<T extends QueryResultRow>(query:string,params:pgParam[]):Promise<QueryResult<T>>{
    const [DataBaseError,client] = await catchError(pool.connect())
    if(DataBaseError){
        if(DataBaseError.message==""){DataBaseError.message = `Unable to establish a connection on DB_PORT ${DB_PORT}`}
        throw new DataBaseConnectionError(DataBaseError.message)
    }
    const [QueryError,queryResult] = await catchError(client.query(query,params))
    client.release()
    if(QueryError){
        throw new QueryExecutionError(QueryError.message)
    }
    return queryResult
}