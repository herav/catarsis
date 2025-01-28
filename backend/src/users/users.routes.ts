import { Router } from "express";
import { getUsers,getUser,postUser,putUser,deleteUser } from "./users.controller";
import { UserSchema } from "./users.schema";
import { UserValidation } from "./users.validation"

const router = Router()
router.get("/users",getUsers)
router.get("/users/:id",getUser)
router.post("/users",UserValidation(UserSchema),postUser)
router.put("/users/:id",putUser)
router.delete("/users/:id",deleteUser)

export default router