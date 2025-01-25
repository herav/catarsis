import express from "express"
import { PORT } from "./config"

import { pool, testConnection } from "./DB"

const app = express()

app.use(express.json())
app.get("/",(_req,res)=>{
    res.send("Hello World!!! This is catarsis")
})

app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`);})
testConnection(pool)