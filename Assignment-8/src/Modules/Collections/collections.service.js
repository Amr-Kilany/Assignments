import { db } from "../../DB/connection.js";

export const createExplicitBooks = async (req, res) => {
  try {
    await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: { bsonType: "string" },
          },
        },
      },
    });
    res.status(201).json({ ok: 1 });
  } catch (error) {
    res.status(500).json({ message: "Collection may already exist", error: error.message });
  }
};

export const createImplicitAuthors = async (req, res) => {
  try {
    const result = await db.collection("authors").insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to insert author", error: error.message });
  }
};

export const createCappedLogs = async (req, res) => {
  try {
    await db.createCollection("logs", { capped: true, size: 1048576 });
    res.status(201).json({ ok: 1 });
  } catch (error) {
    res.status(500).json({ message: "Collection may already exist", error: error.message });
  }
};

export const createBooksIndex = async (req, res) => {
  await db.collection("books").createIndex({ title: 1 });
  res.status(201).json({ title_1: "Index created successfully" });
};
