import { Request,Response } from "express"
import { getUsers,getUser, deleteUser, postUser, putUser } from "../../users/users.controller"
import { UserModel } from "../../users/users.model.pg";
import { catchError } from "../../errors.utils"
import { User } from "../../users/user.class";
import { validateUser,validatePartialUser } from "../../users/users.schema";

jest.mock("../../users/users.model.pg");
jest.mock("../../users/users.schema");
jest.mock("../../errors.utils", () => ({
  catchError: jest.fn(),
}));



const mockUsers:User[] = [
  {
    id: "12f17589-d2c4-4bd3-a0e4-f1c3d1168353",
    name: "ana",
    email: "ana@gmail.com",
    password: "ana123456",
  },
  {
    id: "5c06b94b-6f4b-4707-b9a8-55a57c0906b5",
    name: "tracy",
    email: "tracy@gmail.com",
    password: "tracy123456",
  },
  {
    id: "66af3ec0-0524-4712-bfc1-8890c04934fd",
    name: "bri",
    email: "bri@gmail.com",
    password: "1234567",
  },
  {
    id: "19c7f16a-633d-45b5-97f7-3b060f94e7ed",
    name: "dy",
    email: "dy@gmail.com",
    password: "dy123456",
  },
  {
    id: "5e692fc0-9b11-4782-bbfa-c7e3f9866047",
    name: "herav",
    email: "herav@gmail.com",
    password: "herav123456",
  },
];

const mockError = new Error("UserModel failed");

describe.skip("UsersController",()=>{

    const req:Partial<Request> = {
        params: {name:"ana"},
        body: {}
    }
    const res:Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } 

    console.error = jest.fn();
    JSON.parse = jest.fn();
    
    afterEach(() => {jest.clearAllMocks();});

    describe("getUsers", () => {
        
      it("should Respond status 200 and a list of Users when UserModel.getUsers() returns an array of Users.", async () => {
        (catchError as jest.Mock).mockResolvedValueOnce([undefined, mockUsers]);
        await getUsers(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
      });

      it("should process the error and Respond status 500 and {message:\"Internal Error.\"} when UserModel.getUsers() returns an error.",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([mockError,undefined]);
        await getUsers(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });

      it("should Respond status 404 and {message:\"No users found.\"} when UserModel.getUsers() returns users null",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,null])
        await getUsers(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"No users found."});
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
      });

      it("should process the error and Respond status 500 and {message:\"Internal Error.\"} when UserModel.getUsers() returns users undefined",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,undefined]);
        await getUsers(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(new Error("users is undefined"));
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });

    });

    describe("getUser", ()=>{
      test.todo("What if the name length is less than 2");
      test.todo("What if the name lenght is greater than 100");
      test.todo("What if the name lenght is 0")
      test.todo("What if the name contains invalid characters like numbers o symbols, only letters are allowed");

      it("should Respond status 200 and an User object when name param is valid and UserModel.getUser() returns the data User",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,mockUsers[0]]);
        await getUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers[0]);
        expect(UserModel.getUser).toHaveBeenCalledWith("ana")
      });

      it("should process the error and Respond status 500 and {message:\"Internal Error.\"} when UserModel.getUser throw an error",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([mockError,undefined]);
        await getUser(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Error."});
        expect(UserModel.getUser).toHaveBeenCalledWith("ana")
      });

      it("should process error and Respond status 500 and {message:\"Internal Error.\"} when UserModel.getUser returns user undefined",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,undefined]);
        await getUser(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(new Error("user is undefined"));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message: "Internal Error."});
        expect(UserModel.getUser).toHaveBeenCalledWith("ana")
      });

      it("should Respond status 404 and {message:\"User not found.\"} when UserModel.getUser returns user null",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,null]);
        await getUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "User not found"});
        expect(UserModel.getUser).toHaveBeenCalledWith("ana")
      });

    });

    describe("deleteUser",()=>{
      test.todo("What if the name length is less than 2");
      test.todo("What if the name lenght is greater than 100");
      test.todo("What if the name lenght is 0");
      test.todo("What if the name contains invalid characters like numbers o symbols, only letters are allowed");
      test.todo("What if UserModel.deleteUser returns null")

      it("should Respond status 200 and {message: \"User deleted\"} when name is valid and status is true",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,true]);
        await deleteUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "User deleted"});
        expect(UserModel.deleteUser).toHaveBeenCalledWith("ana");
      });

      it("should Respond status 400 and {message: \"Impossible to delete User\"} when name is valid and status is false",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,false]);
        await deleteUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message:"Impossible to delete User"});
        expect(UserModel.deleteUser).toHaveBeenCalledWith("ana");
      });

      it("should process error and Respond status 500 and {message: \"Internal Error.\"} when UserModel.deleteUser returns an error",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([mockError,undefined]);
        await deleteUser(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."});
        expect(UserModel.deleteUser).toHaveBeenCalledWith("ana");
      });

      it("should process error and Respond status 500 and {message: \"Internal Error.\"} when UserModel.deleteUser returns status undefined",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,undefined]);
        await deleteUser(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(new Error("Delete status is undefined"));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."});
        expect(UserModel.deleteUser).toHaveBeenCalledWith("ana");
      });

    });

    describe("postUser",()=>{
      test.todo("What if validateUser were asynchronous");
      test.todo("What status should respond when user is null, 400 or 500?");
      test.todo("What if req.body contains invalida data");
      it("should Respond status 400 and resultValidation.error.message when resultValidation is not succeeded",async()=>{
        const resultValidationMock = {success:false,error:{message:"Validation ERROR"}};
        
        (validateUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        await postUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:JSON.parse(resultValidationMock.error.message)});
      });

      it("should Respond status 500 and {message:\"Internal Error.\"} when resultValidation is succeeded and UserModel.postUser return error",async()=>{
        const resultValidationMock = {
          success:true,
          data:{"name": "diana", "email":"diana@gmail.com", "password": "diana123456"}
        };

        (validateUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        (catchError as jest.Mock).mockResolvedValueOnce([mockError,undefined]);
        await postUser(req as Request, res as Response);
        expect(UserModel.postUser).toHaveBeenCalledWith({...resultValidationMock.data,id:""});
        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });

      it("should Respond status 500 and {message:\"Internal Error.\"} when resultValidation is succeeded and UserModel.postUser return user undefined",async()=>{
        const resultValidationMock = {
          success:true,
          data:{"name": "diana", "email":"diana@gmail.com", "password": "diana123456"}
        };

        (validateUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,undefined]);
        await postUser(req as Request, res as Response);
        expect(UserModel.postUser).toHaveBeenCalledWith({...resultValidationMock.data,id:""});
        expect(console.error).toHaveBeenCalledWith(new Error("user is undefined"));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });

      it("should Respond status 500 and {message:\"Impossible to save User\"} when resultValidation is succeeded and UserModel.postUser return user null",async()=>{
        const resultValidationMock = {
          success:true,
          data:{"name": "diana", "email":"diana@gmail.com", "password": "diana123456"}
        };

        (validateUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,null]);
        await postUser(req as Request, res as Response);
        expect(UserModel.postUser).toHaveBeenCalledWith({...resultValidationMock.data,id:""});
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Impossible to save User"});
      });

      it("should Respond status 200 and User data when resultValidation is succeeded and UserModel.postUser return a user",async()=>{
        const resultValidationMock = {
          success:true,
          data:{"name": "diana", "email":"diana@gmail.com", "password": "diana123456"}
        };
        const mockUSER = {"name": "diana", "email":"diana@gmail.com", "password": "diana123456","id": "8682dba0-08cf-44ab-8a8d-bc6d486ce272"};

        (validateUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,mockUSER]);
        await postUser(req as Request, res as Response);
        expect(UserModel.postUser).toHaveBeenCalledWith({...resultValidationMock.data,id:""});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUSER);
      });

    });

    describe("putUser",()=>{
      test.todo("What if the name validation is not succeeded");
      test.todo("What if the validationPartialUser function were asynchronous");
      test.todo("What if req.body contains invalida data");
      test.todo("What status should respond when user is null, 400 or 500?");

      it("should Respond status 400 and resultValidation.error.message when resultValidation is not succeeded",async()=>{
        const resultValidationMock = {success:false,error:{message:"Validation ERROR"}};
        
        (validatePartialUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        await putUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error:JSON.parse(resultValidationMock.error.message)});
      });

      it("should Respond status 500 and {message:\"Internal Error.\"} when resultValidation is succeeded and UserModel.putUser return error",async()=>{
        const resultValidationMock = {
          success:true,
          data:{"name": "ana", "email":"ana@gmail.com", "password": "ana123456"}
        };

        (validatePartialUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        (catchError as jest.Mock).mockResolvedValueOnce([mockError,undefined]);
        await putUser(req as Request, res as Response);
        expect(UserModel.putUser).toHaveBeenCalledWith("ana",resultValidationMock.data);
        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });

      it("should Respond status 500 and {message:\"Internal Error.\"} when resultValidation is succeeded and UserModel.putUser return user undefined",async()=>{
        const resultValidationMock = {
          success:true,
          data:{"name": "ana", "email":"ana@gmail.com", "password": "ana123456"}
        };

        (validatePartialUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,undefined]);
        await putUser(req as Request, res as Response);
        expect(UserModel.putUser).toHaveBeenCalledWith("ana",resultValidationMock.data);
        expect(console.error).toHaveBeenCalledWith(new Error("user is undefined"));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });

      it("should Respond status 500 and {message:\"Impossible to update User\"} when resultValidation is succeeded and UserModel.putUser return user null",async()=>{
        const resultValidationMock = {
          success:true,
          data:{"name": "ana", "email":"ana@gmail.com", "password": "ana123456"}
        };

        (validatePartialUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,null]);
        await putUser(req as Request, res as Response);
        expect(UserModel.putUser).toHaveBeenCalledWith("ana",resultValidationMock.data);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Impossible to update User"});
      });

      it("should Respond status 200 and User data when resultValidation is succeeded and UserModel.putUser return a user",async()=>{
        const resultValidationMock = {
          success:true,
          data:{"name": "ana", "email":"ana@gmail.com", "password": "ana123456"}
        };
        const mockUSER = {"name": "diana", "email":"diana@gmail.com", "password": "diana123456","id": "8682dba0-08cf-44ab-8a8d-bc6d486ce272"};

        (validatePartialUser as jest.Mock).mockReturnValueOnce(resultValidationMock);
        (catchError as jest.Mock).mockResolvedValueOnce([undefined,mockUSER]);
        await putUser(req as Request, res as Response);
        expect(UserModel.putUser).toHaveBeenCalledWith("ana",resultValidationMock.data);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUSER);
      });

    });
})