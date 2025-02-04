import { UserInterface } from "./users.interface";

export class User implements UserInterface{
    id:string
    name:string
    email:string
    password: string

    constructor(name:string,email:string,password:string){
        this.id = ""
        this.name = name
        this.email = email
        this. password = password
    }
}