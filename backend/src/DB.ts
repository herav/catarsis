import { DB_USER,DB_HOST,DB_PASSWORD,DB_DATABASE,DB_PORT} from "./config";
import { Pool } from "pg";


export const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: +DB_PORT
})

export async function testConnection(pool:Pool) {
    try{
        const client = await pool.connect()
        const res = await client.query("SELECT NOW()")
        console.log("DB succesfully connected",res.rows[0].now);
        client.release()
    }
    catch(err){
        console.log("DB Error",err);
    }
    finally{
        await pool.end()
    }
}


