import { Request,Response } from "express"
import { getUsers } from "../../users/users.controller"
import { UserModel } from "../../users/users.model.pg";
import { catchError } from "../../errors.utils"
import { User } from "../../users/user.class";

jest.mock("../../users/users.model.pg");
jest.mock("../../errors.utils", () => ({
  catchError: jest.fn(),
}));


const mockUsers:User[] = [
  {
    id: "5c06b94b-6f4b-4707-b9a8-55a57c0906b5",
    name: "tracy",
    email: "tracy@gmail.com",
    password: "tracy123456",
  },
  {
    id: "12f17589-d2c4-4bd3-a0e4-f1c3d1168353",
    name: "ana",
    email: "ana@gmail.com",
    password: "ana123456",
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

describe("UsersController",()=>{

    const req:Partial<Request> = {
        params: {name:"ana"},
        body: {}
    }
    const res:Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    } 

    console.error = jest.fn()
    
    afterEach(() => {jest.clearAllMocks();});

    describe("getUsers", () => {
        
      it("should Respond status 200 and a list of Users when UserModel.getUsers() returns an array of Users.", async () => {
        (catchError as jest.Mock).mockResolvedValueOnce([null, mockUsers]);
        await getUsers(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
      });

      it("should process the error and Respond status 500 and {message:\"Internal Error.\"} when UserModel.getUsers() returns an error.",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([mockError,null]);
        await getUsers(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(mockError);
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });

      it("should Respond status 404 and {message:\"No users found.\"} when UserModel.getUsers() returns []",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([null,[]])
        await getUsers(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message:"No users found."});
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
      });

      it("should process the error and Respond status 500 and {message:\"Internal Error.\"} when UserModel.getUsers() returns null",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([null,null]);
        await getUsers(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(new Error("users is null or undefined"));
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });
      it("should process the error and Respond status 500 and {message:\"Internal Error.\"} when UserModel.getUsers() returns undefined",async()=>{
        (catchError as jest.Mock).mockResolvedValueOnce([null,undefined]);
        await getUsers(req as Request, res as Response);
        expect(console.error).toHaveBeenCalledWith(new Error("users is null or undefined"));
        expect(UserModel.getUsers).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal Error."})
      });
    });

})