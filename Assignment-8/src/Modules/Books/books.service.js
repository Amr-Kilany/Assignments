import booksModel from "../../DB/Models/books.model.js";
import { db } from "../../DB/connection.js";

export const insertOneBook = async (req, res) => {
  try {
    const result = await booksModel.insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: "Document failed validation",
      error: error.message,
    });
  }
};

export const insertMultipleBooks = async (req, res) => {
  try {
    const result = await booksModel.insertMany(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "MongoDB rejected the insert",
      error: error.message,
    });
  }
};

export const updateBookYear = async (req, res) => {
  const result = await booksModel.updateOne({ title: req.params.title }, { $set: { year: 2022 } });
  res.json({
    acknowledged: result.acknowledged,
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  });
};

export const findBookByTitle = async (req, res) => {
  const book = await booksModel.findOne({ title: req.query.title });
  res.json(book);
};

export const findBooksByYearRange = async (req, res) => {
  const from = parseInt(req.query.from);
  const to = parseInt(req.query.to);
  const books = await booksModel.find({ year: { $gte: from, $lte: to } }).toArray();
  res.json(books);
};

export const findBooksByGenre = async (req, res) => {
  const books = await booksModel.find({ genres: req.query.genre }).toArray();
  res.json(books);
};

export const skipAndLimitBooks = async (req, res) => {
  const books = await booksModel.find().sort({ year: -1 }).skip(2).limit(3).toArray();
  res.json(books);
};

export const findYearAsInteger = async (req, res) => {
  const books = await booksModel.find({ year: { $type: "int" } }).toArray();
  res.json(books);
};

export const excludeGenres = async (req, res) => {
  const books = await booksModel.find({ genres: { $nin: ["Horror", "Science Fiction"] } }).toArray();
  res.json(books);
};

export const deleteOldBooks = async (req, res) => {
  const result = await booksModel.deleteMany({ year: { $lt: parseInt(req.query.year) } });
  res.json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
};

export const aggregate1 = async (req, res) => {
  const data = await booksModel.aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }]).toArray();
  res.json(data);
};

export const aggregate2 = async (req, res) => {
  const data = await booksModel
    .aggregate([{ $match: { year: { $gt: 2000 } } }, { $project: { _id: 0, title: 1, author: 1, year: 1 } }])
    .toArray();
  res.json(data);
};

export const aggregate3 = async (req, res) => {
  const data = await booksModel
    .aggregate([{ $unwind: "$genres" }, { $project: { _id: 0, title: 1, genres: 1 } }])
    .toArray();
  res.json(data);
};

export const aggregate4 = async (req, res) => {
  const data = await db
    .collection("logs")
    .aggregate([
      { $addFields: { bookIdObj: { $toObjectId: "$book_id" } } },
      { $lookup: { from: "books", localField: "bookIdObj", foreignField: "_id", as: "book_details" } },
      { $project: { _id: 0, action: 1, "book_details.title": 1, "book_details.author": 1, "book_details.year": 1 } },
    ])
    .toArray();
  res.json(data);
};
