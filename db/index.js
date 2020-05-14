const { Client } = require("pg"); // imports the pg module

// supply the db name and location of the database
const client = new Client("postgres://localhost:5432/juicebox-dev");

module.exports = {
  client,
};

// inside db/index.js

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, name, location, active 
      FROM users;
    `
  );

  return rows;
}

// and export them
module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
};

async function createPost({ authorId, title, content }) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    INSERT INTO posts(authorId, title, content) 
    VALUES($1, $2, $3)
    RETURNING *;
    `, [authorId, title, content]);
    return user
  } catch (error) {
    throw error;
  }
}

async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password, name, location) 
    VALUES($1, $2, $3, $4) 
    ON CONFLICT (username) DO NOTHING 
    RETURNING *;
  `,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  console.log(setString);
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}
