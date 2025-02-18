import { Pool, PoolClient, QueryResult} from 'pg';
import { executeQuery } from '../DB.utils.pg';

jest.mock('pg', () => {
  const PoolClientMock = {
    query: jest.fn(),
    release: jest.fn()
  }
  const PoolMock = {connect: jest.fn().mockResolvedValue(PoolClientMock)};
  return { Pool: jest.fn(() => PoolMock)}; 
});

describe('executeQuery',() => {
  const descriptionTest = {
    happyPath:"Should return a QueryResult object when valid inputs are provided, and the connection to the DB and query execution are successful.",
    DB:"Should throw a DatabaseConnectionError when the database connection fails.",
    Query:"Should throw a QueryExecutionError when the query fails to execute due to invalid query syntax or parameters."
  }

  let pool: Pool
  let client: PoolClient

  beforeEach(()=>{
    jest.clearAllMocks();
    pool = new Pool();
    
  })

  it(descriptionTest.happyPath,async()=>{
    let expectResult: QueryResult = {
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
      rows: [{name: 'Ana', email:"ana@gmail.com"}]
    }

    client = await pool.connect() as unknown as PoolClient;
    (client.query as jest.Mock).mockResolvedValue(expectResult);
  
    const result = await executeQuery("query",["param"])
 
    expect(result).toBe(expectResult)
  })

  it(descriptionTest.DB, async () => {
    (pool.connect as jest.Mock).mockRejectedValueOnce(new Error("DatabaseConnectionError"))

    await expect(executeQuery("query", ["param"])).rejects.toThrow("DatabaseConnectionError")
    expect(pool.connect).toHaveBeenCalled();
  });

  it(descriptionTest.Query, async () => {
    client = await pool.connect() as unknown as PoolClient;
    (client.query as jest.Mock).mockRejectedValue(new Error("QueryExecutionError"))

    await expect(executeQuery("query", ["param"])).rejects.toThrow("QueryExecutionError")
    expect(client.query).toHaveBeenCalled();
  });

});