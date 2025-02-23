import { UserModel } from "../../users/users.model.pg";
import { executeQuery } from "../../DB.utils.pg";
import { getUsersQuery,getUserQuery,deleteUserQuery,uuidQuery,postUserQuery,getUserByIDQuery, putUserQuery} from "../../users/users.querys";
import { catchError } from "../../errors.utils";
import { User } from "../../users/user.class";

jest.mock("../../DB.utils.pg", () => ({
  executeQuery: jest.fn()
}));

jest.mock("../../errors.utils", () => ({
  catchError: jest.fn()
}));

jest.mock("../../users/users.querys", () => ({
  putUserQuery: jest.fn()
}));

describe.skip('UserModel', () => {
  describe("getUsers", () => {

    beforeEach(()=>{jest.clearAllMocks(); })

    it('should return a list of users', async () => {
      const mockUsers: User[] = [
        {id:'1', name:'userX', email:'userX@example.com', password:'1234567'},
        {id:'2', name:'userY', email:'userY@example.com', password:'1234567'},
      ];
      (catchError as jest.Mock).mockResolvedValueOnce([null, { rows: mockUsers }]);
      const result = await UserModel.getUsers();
      expect(executeQuery).toHaveBeenCalledWith(getUsersQuery, []);
      expect(result).toEqual(mockUsers);
    });

    it('should throw an error if executeQuery fails', async () => {
      const mockError = new Error('QueryExecutionError');
      (catchError as jest.Mock).mockResolvedValueOnce([mockError, null]);
      await expect(UserModel.getUsers()).rejects.toThrow(mockError);
    });
  });

  describe("getUser",()=>{
    beforeEach(()=>{jest.clearAllMocks(); })
    it("Should return a User",async ()=>{
        const mockUser: User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
        (catchError as jest.Mock).mockResolvedValueOnce([null, {rows:[mockUser]}]);
        const result = await UserModel.getUser("userX");
        expect(executeQuery).toHaveBeenCalledWith(getUserQuery,["userX"]);
        expect(result).toEqual(mockUser);
    })

    it("should throw an error when executeQuery fails",async ()=>{
        const mockError = new Error("QueryExecutionError");
        (catchError as jest.Mock).mockRejectedValueOnce(mockError);
        await expect(UserModel.getUser("userX")).rejects.toThrow(mockError)
    })
  })

  describe("deleteUser",()=>{
    beforeEach(()=>{jest.clearAllMocks(); })
    it("should return the string: User deleted successfully",async()=>{
      (catchError as jest.Mock).mockResolvedValueOnce([null,"User deleted succesfully"]);
      const result = await UserModel.deleteUser("userX")
      expect(executeQuery).toHaveBeenCalledWith(deleteUserQuery,["userX"])
      expect(result).toBe("User deleted succesfully")
    })

    it("should throw an error when execute query fails",async()=>{
      const error = new Error("QueryExecutionError");
      (catchError as jest.Mock).mockRejectedValueOnce(error);
      await expect(UserModel.deleteUser("userx")).rejects.toThrow(error)
    })
  })

  describe("postUser",()=>{
    beforeEach(()=>{jest.clearAllMocks();})
    
    it('should create a new user and return it', async () => {
      const mockUser = new User('userX', 'userX@example.com', '1234567');

      (catchError as jest.Mock)
        .mockResolvedValueOnce([null, { rows: [{ gen_random_uuid: '1' }] }])
        .mockResolvedValueOnce([null, { rows: [] }])
        .mockResolvedValueOnce([null, { rows: [{ ...mockUser, id: '1' }] }]);

      const result = await UserModel.postUser(mockUser);

      expect(executeQuery).toHaveBeenCalledWith(uuidQuery, []);
      expect(executeQuery).toHaveBeenCalledWith(postUserQuery, ['1', mockUser.name, mockUser.email, mockUser.password]);
      expect(executeQuery).toHaveBeenCalledWith(getUserQuery, [mockUser.name]);
      expect(result).toEqual({ ...mockUser, id: '1' });
    });

    it('should throw an error if uuidQuery fails', async () => {
      const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
      const mockError = new Error('UUID generation error');
      (catchError as jest.Mock).mockResolvedValueOnce([mockError, null]);
      await expect(UserModel.postUser(mockUser)).rejects.toThrow(mockError);
    });

    it('should throw an error if postUserQuery fails', async () => {
      const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
      const mockError = new Error('Insert user error');

      (catchError as jest.Mock)
        .mockResolvedValueOnce([null, {rows:[{gen_random_uuid:'1'}]}]) 
        .mockResolvedValueOnce([mockError, null]); 

      await expect(UserModel.postUser(mockUser)).rejects.toThrow(mockError);
    });

    it('should throw an error if getUserQuery fails after insertion', async () => {
      const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
      const mockError = new Error('Fetch inserted user error');

      (catchError as jest.Mock)
        .mockResolvedValueOnce([null, {rows:[{gen_random_uuid:'1'}]}])
        .mockResolvedValueOnce([null, {rows: [] }])
        .mockResolvedValueOnce([mockError, null]);

      await expect(UserModel.postUser(mockUser)).rejects.toThrow(mockError);
    });
  })

  describe("putUser",()=>{
    beforeEach(()=>{jest.clearAllMocks();})

    it("should update a user and return it",async()=>{
      const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
      const mockUpdatedUser:User = {id:'1', name:'userXY', email:'userXY@example.com', password:'XY1234567'};

      (catchError as jest.Mock)
      .mockResolvedValueOnce([null,{rows:[mockUser]}])
      .mockResolvedValueOnce([null,{putQuery:"UPDATE",values:['userXY','userXY@example.com','XY1234567']}])
      .mockResolvedValueOnce([null,{rows:[]}])
      .mockResolvedValueOnce([null,{rows:[mockUpdatedUser]}])

      const result = await UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'});

      expect(executeQuery).toHaveBeenCalledWith(getUserQuery,["userX"]);
      expect(executeQuery).toHaveBeenCalledWith("UPDATE",['userXY','userXY@example.com','XY1234567']);
      expect(executeQuery).toHaveBeenCalledWith(getUserByIDQuery,["1"]);
      expect(result).toEqual(mockUpdatedUser);
    })

    it("should throw an error when executeQuery(getUserQuery,[name]) fails.",async ()=>{
      const mockError = new Error("QueryExecutionError");
      (catchError as jest.Mock).mockResolvedValueOnce([mockError,null]);
      await expect(UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})).rejects.toThrow(mockError);
    })

    it("should throw an error when putUserQuery() fails",async()=>{
      const mockError = new Error("ExecutionError");
      const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
      (catchError as jest.Mock)
      .mockResolvedValueOnce([null,{rows:[mockUser]}])
      .mockResolvedValueOnce([mockError,null]);
      await expect(UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})).rejects.toThrow(mockError);
      expect(executeQuery).toHaveBeenCalledWith(getUserQuery,["userX"])
    })

    it("should throw an error when executeQuery(putQuery,values) fails",async()=>{
      const mockError = new Error("ExecutionError");
       const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};

      (catchError as jest.Mock)
      .mockResolvedValueOnce([null,{rows:[mockUser]}])
      .mockResolvedValueOnce([null,{putQuery:"UPDATE",values:['userXY','userXY@example.com','XY1234567']}])
      .mockResolvedValueOnce([mockError,null]);
      await expect(UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})).rejects.toThrow(mockError);
      expect(executeQuery).toHaveBeenCalledWith(getUserQuery,["userX"])
      expect(putUserQuery).toHaveBeenCalledWith("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})
    })

    it("should throw an error when executeQuery(getUserByIDQuery,[id]) fails",async()=>{
      const mockError = new Error("ExecutionError");
      const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};

      (catchError as jest.Mock)
      .mockResolvedValueOnce([null,{rows:[mockUser]}])
      .mockResolvedValueOnce([null,{putQuery:"UPDATE",values:['userXY','userXY@example.com','XY1234567']}])
      .mockResolvedValueOnce([null,{rows:[]}])
      .mockResolvedValueOnce([mockError,null]);
      await expect(UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})).rejects.toThrow(mockError);
      expect(executeQuery).toHaveBeenCalledWith(getUserQuery,["userX"]);
      expect(putUserQuery).toHaveBeenCalledWith("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})
      expect(executeQuery).toHaveBeenCalledWith("UPDATE",['userXY','userXY@example.com','XY1234567']);
    })

  })
});