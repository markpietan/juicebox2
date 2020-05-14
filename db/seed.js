const { client, getAllUsers, createUser, updateUser } = require("./index");

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    await client.query(`
    DROP TABLE IF EXISTS posts;
    `);  
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

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "",
    });
    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "",
    });

    console.log(albert);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    await client.query(`
      CREATE TABLE users (
        name varchar(255) NOT NULL,
        location varchar(255),
        active boolean default true,  
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    
  
      `);
    await client.query(`
    CREATE TABLE posts (
        id serial primary key,
        "authorID" integer references users(id) NOT NULL,
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
    );
    `)

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
