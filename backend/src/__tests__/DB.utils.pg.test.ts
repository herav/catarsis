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
  const descriptions = {
    happyPath:"Should return a QueryResult because everything went right"
  }

  afterEach(() => {jest.clearAllMocks();});

  it(descriptions.happyPath,async()=>{
    let pool: Pool;
    let client: PoolClient
    let expectResult: QueryResult = {
      command: 'SELECT',
      rowCount: 1,
      oid: 0,
      fields: [],
      rows: [{name: 'Ana', email:"ana@gmail.com"}]
    }

    pool = new Pool(); 
    client = await pool.connect() as unknown as PoolClient;
    (client.query as jest.Mock).mockResolvedValue(expectResult);
  
    const result = await executeQuery("query",["param"])
 
    expect(pool.connect).toHaveBeenCalled()
    expect(client.query).toHaveBeenCalled()
    expect(client.release).toHaveBeenCalled()
    expect(result).toBe(expectResult)
  })
});