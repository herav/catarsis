import {z} from "zod"

export const UserSchema = z.object({
    id:z.number().nonnegative().optional(),
    email:z.string().nonempty("Email required").email({message:"Wrong Email"}),
    password: z.string().nonempty("Password Required").min(6,"To Short")
})

