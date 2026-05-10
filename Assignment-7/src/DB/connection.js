import dotenv from "dotenv";
dotenv.config({ path: "./src/config/dev.env" });
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export const syncDB = async () => {
  try {
    const { UsersModel } = await import("./Models/users.model.js");
    const { PostsModel } = await import("./Models/posts.model.js");
    const { CommentsModel } = await import("./Models/comments.model.js");

    // Associations
    UsersModel.hasMany(PostsModel, { foreignKey: "userId" });
    PostsModel.belongsTo(UsersModel, { foreignKey: "userId" });

    UsersModel.hasMany(CommentsModel, { foreignKey: "userId" });
    CommentsModel.belongsTo(UsersModel, { foreignKey: "userId" });

    PostsModel.hasMany(CommentsModel, { foreignKey: "postId" });
    CommentsModel.belongsTo(PostsModel, { foreignKey: "postId" });

    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully!");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
};
