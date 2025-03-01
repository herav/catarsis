export const getUsersQuery = "SELECT id,name,email,password FROM users"
export const getUserQuery = "SELECT * FROM users WHERE name = $1"
export const getUserByIDQuery = "SELECT * FROM users WHERE id = $1"
export const getUserIDQuery = "SELECT id FROM users WHERE name = $1"
export const getUserEmailQuery = "SELECT email FROM users WHERE email = $1"
export const uuidQuery = "SELECT gen_random_uuid()"
export const postUserQuery = "INSERT INTO users (id,name,email,password) VALUES ($1,$2,$3,$4)"
export const deleteUserQuery = "DELETE FROM users where name = $1"
export const putUserQuery = async (name:string,data:Record<string,any>):Promise<{putQuery:string, values:string[]}>=>{
    const values:any[] = []
        const clauses:string[]=[]
        let index = 1
        for(const key in data){
            if(data.hasOwnProperty(key)){
                clauses.push(`${key} = $${index}`)
                values.push(data[key])
                index++
            }
        }
        values.push(name)
        return {putQuery:`UPDATE users SET ${clauses.join(', ')} WHERE name = $${index}`, values:values}
}
