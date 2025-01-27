import express from "express"
import { PORT } from "./config"
import UserRuter from "./users/users.routes"

const app = express()

app.use(express.json())
app.get("/",(_req,res)=>{res.send("Hello World!!! This is catarsis")})
app.use(UserRuter)

app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`);})
