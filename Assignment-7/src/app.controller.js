import dotenv from "dotenv";
dotenv.config({ path: "./src/config/dev.env" });

import { usersRouter, postsRouter, commentsRouter } from "./Modules/index.js";
import { connectDB, syncDB } from "./DB/connection.js";
import { UsersModel } from "./DB/Models/users.model.js";
import { PostsModel } from "./DB/Models/posts.model.js";
import { CommentsModel } from "./DB/Models/comments.model.js";

export const bootstrap = async (app, express) => {
  app.use(express.json());

  await connectDB();
  await syncDB();

  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/posts", postsRouter);
  app.use("/api/v1/comments", commentsRouter);

  app.all("/*dummy", (req, res) => {
    return res.status(404).json({
      message: "Route not found",
    });
  });
};
