import { db } from "../connection.js";

const booksModel = db.collection("books");

export default booksModel;
