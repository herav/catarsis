import { catchError } from "../errors.utils";

describe.only('catchError', () => {

    it('Should return [undefined, data] when the promise resolves', async () => {
      const result = await catchError(Promise.resolve("successful"))
      expect(result).toEqual([undefined, "successful"]);
    });
  
    it('Should return [error] when the promise rejects', async () => {
      const error = new Error('rejected');
      const result = await catchError(Promise.reject(error));
      expect(result).toEqual([error]);
    });
  
    it('Should handle promises resolving with different types of data', async () => {
      const numberResult = await catchError(Promise.resolve(42));
      const objectResult = await catchError(Promise.resolve({ name: 'vic' }));
      const booleanResult = await catchError(Promise.resolve(true))
  
      expect(numberResult).toEqual([undefined, 42]);
      expect(objectResult).toEqual([undefined, { name: 'vic' }]);
      expect(booleanResult).toEqual([undefined,true])
    });

    it('Should work with generic types', async () => {
      const genericPromise: Promise<{ id: number; name: string }> = Promise.resolve({ id: 1, name: 'vic' });
      const result = await catchError(genericPromise);
      expect(result).toEqual([undefined, { id: 1, name: 'vic' }]);
    });
  
  
    it('Should handle promises that take time to resolve or reject', async () => {
      const resolvePromise = new Promise<string>((resolve) => setTimeout(() => resolve('successful'), 100));
      const rejectPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('rejected')), 100));
  
      const resolvedResult = await catchError(resolvePromise);
      const rejectedResult = await catchError(rejectPromise);
  
      expect(resolvedResult).toEqual([undefined, 'successful']);
      expect(rejectedResult).toEqual([new Error('rejected')]);
    });
  
  });