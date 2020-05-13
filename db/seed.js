const {
  client,
  getAllUsers,
   createUser// new
} = require("./index");

async function testDB() {
  try {

    const users = await getAllUsers();
    console.log(users);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// inside db/seed.js

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    await client.query(`
      DROP TABLE IF EXISTS users;
      `);
  } catch (error) {
    throw error; // we pass the error up to the function that calls dropTables
  }
}

async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
     
      const albert = await createUser({ username: 'albert', password: 'bertie99' });
      const sandra = await createUser({ username: 'sandra', password: '2sandy4me' });
      const glamgal = await createUser({ username: 'glamgal', password: 'soglam' });
  
      console.log(albert);
  
      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
      `);
  } catch (error) {
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
