import { UserModel } from "../../users/users.model.pg";
import { executeQuery } from "../../DB.utils.pg";
import { getUsersQuery,getUserQuery,deleteUserQuery,uuidQuery,postUserQuery,getUserByIDQuery, putUserQuery,getUserEmailQuery,getUserIDQuery} from "../../users/users.querys";
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

describe('UserModel', () => {
  describe.skip("getUsers", () => {

    beforeEach(()=>{jest.clearAllMocks(); })

    it('should return a list of users when rowCount is a number greater than 0', async () => {
      const mockUsers: User[] = [
        {id:'1', name:'userX', email:'userX@example.com', password:'1234567'},
        {id:'2', name:'userY', email:'userY@example.com', password:'1234567'},
      ];
      (catchError as jest.Mock).mockResolvedValueOnce([null, { rowCount:2,rows: mockUsers }]);
      const result = await UserModel.getUsers();
      expect(executeQuery).toHaveBeenCalledWith(getUsersQuery, []);
      expect(result).toEqual(mockUsers);
    });

    it('should return null of users when rowCount is not a number', async () => {
      (catchError as jest.Mock).mockResolvedValueOnce([null, { rowCount:undefined,rows: undefined }]);
      const result = await UserModel.getUsers();
      expect(executeQuery).toHaveBeenCalledWith(getUsersQuery, []);
      expect(result).toEqual(null);
    });

    it('should return null of users when rowCount is a number equal to 0', async () => {
      (catchError as jest.Mock).mockResolvedValueOnce([null, { rowCount:0,rows: [] }]);
      const result = await UserModel.getUsers();
      expect(executeQuery).toHaveBeenCalledWith(getUsersQuery, []);
      expect(result).toEqual(null);
    });

    it('should throw an error if executeQuery fails', async () => {
      const mockError = new Error('QueryExecutionError');
      (catchError as jest.Mock).mockResolvedValueOnce([mockError, null]);
      await expect(UserModel.getUsers()).rejects.toThrow(mockError);
    });
  });

  describe.skip("getUser",()=>{
    beforeEach(()=>{jest.clearAllMocks(); })
    it("Should return a User when rowCount is a number equal to 1",async ()=>{
        const mockUser: User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
        (catchError as jest.Mock).mockResolvedValueOnce([null, {rowCount: 1,rows:[mockUser]}]);
        const result = await UserModel.getUser("userX");
        expect(executeQuery).toHaveBeenCalledWith(getUserQuery,["userX"]);
        expect(result).toEqual(mockUser);
    });

    it("Should return a null when rowCount is not a number",async ()=>{
      (catchError as jest.Mock).mockResolvedValueOnce([null, {rowCount: undefined,rows:undefined}]);
      const result = await UserModel.getUser("userX");
      expect(executeQuery).toHaveBeenCalledWith(getUserQuery,["userX"]);
      expect(result).toEqual(null);
    });

    it("Should return a null when rowCount is a number different to 1",async ()=>{
      (catchError as jest.Mock).mockResolvedValueOnce([null, {rowCount: 0,rows:[]}]);
      const result = await UserModel.getUser("userX");
      expect(executeQuery).toHaveBeenCalledWith(getUserQuery,["userX"]);
      expect(result).toEqual(null);
    });

    it("should throw an error when executeQuery fails",async ()=>{
        const mockError = new Error("QueryExecutionError");
        (catchError as jest.Mock).mockRejectedValueOnce(mockError);
        await expect(UserModel.getUser("userX")).rejects.toThrow(mockError)
    });
  })

  describe.skip("deleteUser",()=>{
    beforeEach(()=>{jest.clearAllMocks(); })
    it("should return true when rowCount is a number equal to 1",async()=>{
      (catchError as jest.Mock).mockResolvedValueOnce([null,{rowCount:1,rows:[]}]);
      const result = await UserModel.deleteUser("userX")
      expect(executeQuery).toHaveBeenCalledWith(deleteUserQuery,["userX"])
      expect(result).toBe(true)
    });

    it("should return false when rowCount is a number different to 1",async()=>{
      (catchError as jest.Mock).mockResolvedValueOnce([null,{rowCount:0,rows:[]}]);
      const result = await UserModel.deleteUser("userX")
      expect(executeQuery).toHaveBeenCalledWith(deleteUserQuery,["userX"])
      expect(result).toBe(false)
    });

    it("should return false when rowCount is not a number",async()=>{
      (catchError as jest.Mock).mockResolvedValueOnce([null,{rowCount:undefined,rows:undefined}]);
      const result = await UserModel.deleteUser("userX")
      expect(executeQuery).toHaveBeenCalledWith(deleteUserQuery,["userX"])
      expect(result).toBe(false)
    });

    it("should throw an error when execute query fails",async()=>{
      const error = new Error("QueryExecutionError");
      (catchError as jest.Mock).mockRejectedValueOnce(error);
      await expect(UserModel.deleteUser("userx")).rejects.toThrow(error)
    });
  })

  describe.skip("postUser",()=>{
    beforeEach(()=>{jest.clearAllMocks();})
    
    it('should return the user created when email is no registered', async () => {
      const mockUser = new User('userX', 'userX@example.com', '1234567');

      (catchError as jest.Mock)
        .mockResolvedValueOnce([undefined, { rowCount: 0, rows: [] }])
        .mockResolvedValueOnce([undefined, { rows: [{ gen_random_uuid: '1' }] }])
        .mockResolvedValueOnce([undefined, { rowCount: 1, rows: [{ ...mockUser, id: '1' }] }]);

      const result = await UserModel.postUser(mockUser);

      expect(executeQuery).toHaveBeenCalledWith(getUserEmailQuery, ['userX@example.com']);
      expect(executeQuery).toHaveBeenCalledWith(uuidQuery, []);
      expect(executeQuery).toHaveBeenCalledWith(postUserQuery, ['1', mockUser.name, mockUser.email, mockUser.password]);
      expect(result).toEqual({ ...mockUser, id: '1' });
    });

    it('should return null when EMAILqueryResult.rowCount is a number equal to 1', async () => {
      const mockUser = new User('userX', 'userX@example.com', '1234567');
      (catchError as jest.Mock).mockResolvedValueOnce([undefined,{rowCount:1,rows: ['userX@example.com']}]);
      const result = await UserModel.postUser(mockUser);
      expect(executeQuery).toHaveBeenCalledWith(getUserEmailQuery, ['userX@example.com']);
      expect(result).toEqual(null);
    });

    it('should throw an error when executeQuery(uuidQuery,[]) fails', async () => {
      const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
      const mockError = new Error('UUID generation error');
      (catchError as jest.Mock).mockResolvedValueOnce([mockError, null]);
      await expect(UserModel.postUser(mockUser)).rejects.toThrow(mockError);
    });

    it('should throw an error when postUserQuery fails', async () => {
      const mockUser:User = {id:'1', name:'userX', email:'userX@example.com', password:'1234567'};
      const mockError = new Error('Insert user error');

      (catchError as jest.Mock)
        .mockResolvedValueOnce([null, {rows:[{gen_random_uuid:'1'}]}]) 
        .mockResolvedValueOnce([mockError, null]); 

      await expect(UserModel.postUser(mockUser)).rejects.toThrow(mockError);
    });

    it('should return null when queryResult.rowCount is a number equal to 0', async () => {
      const mockUser = new User('userX', 'userX@example.com', '1234567');

      (catchError as jest.Mock)
        .mockResolvedValueOnce([undefined, { rowCount: 0, rows: [] }])
        .mockResolvedValueOnce([undefined, { rows: [{ gen_random_uuid: '1' }] }])
        .mockResolvedValueOnce([undefined, { rowCount: 0, rows: [] }]);

      const result = await UserModel.postUser(mockUser);

      expect(executeQuery).toHaveBeenCalledWith(getUserEmailQuery, ['userX@example.com']);
      expect(executeQuery).toHaveBeenCalledWith(uuidQuery, []);
      expect(executeQuery).toHaveBeenCalledWith(postUserQuery, ['1', mockUser.name, mockUser.email, mockUser.password]);
      expect(result).toEqual(null);
    });
  })

  describe("putUser",()=>{
    beforeEach(()=>{jest.clearAllMocks();})

    it("should return the user updated",async()=>{
      const mockUpdatedUser:User = {id:'1', name:'userXY', email:'userXY@example.com', password:'XY1234567'};

      (catchError as jest.Mock)
      .mockResolvedValueOnce([undefined,{rowCount: 1, rows:[{id:'1'}]}])
      .mockResolvedValueOnce([undefined,{putQuery:"UPDATE",values:['userXY','userXY@example.com','XY1234567']}])
      .mockResolvedValueOnce([undefined,{rowCount: 1, rows:[]}])
      .mockResolvedValueOnce([undefined,{rows:[mockUpdatedUser]}])

      const result = await UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'});

      expect(executeQuery).toHaveBeenCalledWith(getUserIDQuery,["userX"]);
      expect(executeQuery).toHaveBeenCalledWith("UPDATE",['userXY','userXY@example.com','XY1234567']);
      expect(executeQuery).toHaveBeenCalledWith(getUserByIDQuery,["1"]);
      expect(result).toEqual(mockUpdatedUser);
    });

    it("should throw an error when executeQuery(getUserIDQuery,[name]) fails.",async ()=>{
      const mockError = new Error("QueryExecutionError");
      (catchError as jest.Mock).mockResolvedValueOnce([mockError,undefined]);
      await expect(UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})).rejects.toThrow(mockError);
    });

    it("should return null when UserIDqueryResult.rowCount is a number equal to 0.",async ()=>{
      (catchError as jest.Mock).mockResolvedValueOnce([undefined,{rowCount: 0, rows:[]}]);

      const result = await UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'});
      expect(result).toEqual(null);
    });


    it("should throw an error when putUserQuery() fails",async()=>{
      const mockError = new Error("ExecutionError");
      (catchError as jest.Mock)
      .mockResolvedValueOnce([undefined,{rowCount: 1, rows:[{id:'1'}]}])
      .mockResolvedValueOnce([mockError,null]);
      await expect(UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})).rejects.toThrow(mockError);
      expect(executeQuery).toHaveBeenCalledWith(getUserIDQuery,["userX"])
    });

    it("should throw an error when executeQuery(putQuery,values) fails",async()=>{
      const mockError = new Error("ExecutionError");

      (catchError as jest.Mock)
      .mockResolvedValueOnce([undefined,{rowCount: 1, rows:[{id:'1'}]}])
      .mockResolvedValueOnce([undefined,{putQuery:"UPDATE",values:['userXY','userXY@example.com','XY1234567']}])
      .mockResolvedValueOnce([mockError,null]);
      await expect(UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})).rejects.toThrow(mockError);
      expect(executeQuery).toHaveBeenCalledWith(getUserIDQuery,["userX"])
      expect(putUserQuery).toHaveBeenCalledWith("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})
    });

    it("should throw an error when executeQuery(getUserByIDQuery,[id]) fails",async()=>{
      const mockError = new Error("ExecutionError");

      (catchError as jest.Mock)
      .mockResolvedValueOnce([null,{rowCount: 1, rows:[{id:'1'}]}])
      .mockResolvedValueOnce([null,{putQuery:"UPDATE",values:['userXY','userXY@example.com','XY1234567']}])
      .mockResolvedValueOnce([null,{rowCount:1, rows:[]}])
      .mockResolvedValueOnce([mockError,null]);
      
      await expect(UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})).rejects.toThrow(mockError);

      expect(executeQuery).toHaveBeenCalledWith(getUserIDQuery,["userX"]);
      expect(putUserQuery).toHaveBeenCalledWith("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'})
      expect(executeQuery).toHaveBeenCalledWith("UPDATE",['userXY','userXY@example.com','XY1234567']);
    });

    it("should return null when queryResult.rowCount is a number equal to cero",async ()=>{
      (catchError as jest.Mock)
      .mockResolvedValueOnce([null,{rowCount: 1, rows:[{id:'1'}]}])
      .mockResolvedValueOnce([null,{putQuery:"UPDATE",values:['userXY','userXY@example.com','XY1234567']}])
      .mockResolvedValueOnce([null,{rowCount:0, rows:[]}]);

      const result = await UserModel.putUser("userX",{name:'userXY', email:'userXY@example.com', password:'XY1234567'});
      expect(result).toEqual(null);

    });

  });
});