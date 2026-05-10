import { PostsModel } from "../../DB/Models/posts.model.js";
import { UsersModel } from "../../DB/Models/users.model.js";
import { CommentsModel } from "../../DB/Models/comments.model.js";
import { sequelize } from "../../DB/connection.js";

// 1. Create new Post (new instance & save)
export const createPost = async (req, res) => {
  try {
    const post = new PostsModel(req.body);
    await post.save();
    return res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 2. Delete a post by id (Owner only)
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await PostsModel.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    await post.destroy();
    return res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Retrieve all posts + specific user/comment details
export const getPostDetails = async (req, res) => {
  try {
    const posts = await PostsModel.findAll({
      attributes: ["id", "title"],
      include: [
        { model: UsersModel, attributes: ["id", "name"] },
        { model: CommentsModel, attributes: ["id", "content"] },
      ],
    });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Retrieve all posts and count associated comments
export const getCommentCount = async (req, res) => {
  try {
    const posts = await PostsModel.findAll({
      attributes: ["id", "title", [sequelize.fn("COUNT", sequelize.col("Comments.id")), "commentCount"]],
      include: [{ model: CommentsModel, attributes: [] }],
      group: ["Posts.id"],
    });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
