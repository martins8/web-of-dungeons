import { Client } from "pg";

//Query function
async function query(queryObject: any) {
  let client: any;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
    console.log("🔴 db client has disconnected");
  }
}

//create client function
async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  console.log("🟢 db client has connected");
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
