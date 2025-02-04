import {z} from "zod"

export const UserSchema = z.object({
    name: z.string().nonempty("name required"),
    email:z.string().nonempty("Email required").email({message:"Wrong Email"}),
    password: z.string().nonempty("Password Required").min(6,"To Short")
})

export function validateUser(body:any){
    return UserSchema.safeParse(body)
}

export function validatePartialUser(body:any){
    return UserSchema.partial().safeParse(body)
}