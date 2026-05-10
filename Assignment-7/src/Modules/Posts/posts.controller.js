import { Router } from "express";
import * as postsService from "./posts.service.js";

const router = Router();
router.post("/", postsService.createPost);
router.delete("/:postId", postsService.deletePost);
router.get("/details", postsService.getPostDetails);
router.get("/comment-count", postsService.getCommentCount);

export default router;
