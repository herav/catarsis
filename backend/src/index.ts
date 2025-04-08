import express from "express"
import { PORT } from "./config"
import UsersRouter from "./users/users.routes"
import { corsHandler } from "./cors"
import cookieParser from "cookie-parser"
import { validateAccessToken } from "./access_token"

const app = express()
app.disable("x-powered-by")
app.use(express.json())
app.use(corsHandler)
app.use(cookieParser())
app.use(validateAccessToken)
app.get("/",(_req,res)=>{res.send("Hello World!!! This is catarsis")})
app.use(UsersRouter)

app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`);})
