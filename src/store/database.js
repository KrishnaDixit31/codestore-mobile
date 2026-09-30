import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("mydb.db");

export const parseTags = (tags) =>
  String(tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

// create table
export const createTable = async () => {
  try {
    const db = await dbPromise;

    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS snippets(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            language TEXT,
            tags TEXT,
            codeSnippet TEXT,
            isFavorite INTEGER,
            createdAt INTEGER
            )
        `);
  } catch (error) {
    console.log(error);
  }
};

// insert data
export const insertData = async (title, language, tags, codeSnippet) => {
  try {
    const db = await dbPromise;

    const isFavorite = 0;
    const createdAt = Date.now();
    const normalizedTags = parseTags(tags).join(", ");
    await db.runAsync(
      `
            INSERT INTO snippets (title ,
            language ,
            tags ,
            codeSnippet ,
            isFavorite,
            createdAt) VALUES (?,?,?,?,?,?)
        `,
      title,
      language,
      normalizedTags,
      codeSnippet,
      isFavorite,
      createdAt,
    );
  } catch (error) {
    console.log(error, "insert");
  }
};

// get data
export const getSingleData = async (id) => {
  try {
    const db = await dbPromise;

    const SingleData = await db.getFirstAsync(
      `SELECT * FROM snippets WHERE id = ?`,
      id,
    );
    return SingleData;
  } catch (error) {
    console.log(error);
  }
};
export const getAllData = async () => {
  try {
    const db = await dbPromise;

    const allData = await db.getAllAsync(`SELECT * FROM snippets`);
    return allData;
  } catch (error) {
    console.log(error, "hii");
  }
};

// edit data
export const updateSnippet = async (id, title, language, tags, codeSnippet) => {
  const db = await dbPromise;
  const normalizedTags = parseTags(tags).join(", ");

  await db.runAsync(
    `UPDATE snippets
     SET title = ?, language = ?, tags = ?, codeSnippet = ?
     WHERE id = ?`,
    title,
    language,
    normalizedTags,
    codeSnippet,
    id,
  );
};
export const toggleFavorite = async (id, isFavorite) => {
  const db = await dbPromise;

  await db.runAsync(
    `UPDATE snippets
     SET isFavorite = ?
     WHERE id = ?`,
    isFavorite ? 1 : 0,
    id,
  );
};

// delete data
export const deleteData = async (id) => {
  try {
    const db = await dbPromise;

    await db.runAsync("DELETE FROM snippets WHERE id=?", id);
  } catch (error) {
    console.log(error);
  }
};

// Drop Table
export const dropTable = async () => {
  try {
    const db = await dbPromise;

    await db.runAsync("DELETE FROM snippets;");
  } catch (error) {
    console.log(error);
  }
};
