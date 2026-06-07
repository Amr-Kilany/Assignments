import { usersRouter, notesRouter } from "./Modules/index.js";
import { connectDB } from "./DB/connection.js";

export const bootstrap = async (app, express) => {
  app.use(express.json());
  await connectDB();

  app.use("/users", usersRouter);
  app.use("/notes", notesRouter);

  app.all("/*dummy", (req, res) => {
    res.status(404).json({ message: "Not Found!" });
  });
};
