import { Router } from "express";
import { getUsers,getUser,postUser,putUser,deleteUser,signup,login} from "./users.controller";

const router = Router()
router.get("/users",getUsers)
router.get("/users/:name",getUser)
router.post("/users",postUser)
router.put("/users/:name",putUser)
router.delete("/users/:name",deleteUser)
router.post("/users/signup",signup)
router.post("/users/login",login)

export default router