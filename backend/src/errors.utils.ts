export function catchError<T>(promise:Promise<T>):Promise<[undefined,T]|[Error]>{
    return promise
    .then(data=>{return [undefined,data] as [undefined,T]})
    .catch(error=>{return[error]})
}

const createCustomError = (name:string)=>{
    return class CustomError extends Error{
        constructor(message:string){
            super(message)
            this.name = name
        }
    }
}

export const DataBaseConnectionError = createCustomError("DataBaseConnectionError")
export const QueryExecutionError = createCustomError("QueryExecutionError")