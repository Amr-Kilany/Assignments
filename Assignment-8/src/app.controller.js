import { booksRouter, collectionsRouter, logsRouter } from "./Modules/index.js";
import { connectDB } from "./DB/connection.js";

export const bootstrap = async (app, express) => {
  app.use(express.json());
  await connectDB();

  app.use("/collection", collectionsRouter);
  app.use("/books", booksRouter);
  app.use("/logs", logsRouter);

  app.all("/*any", (req, res) => {
    res.status(404).json({ message: "Not Found!" });
  });
};
