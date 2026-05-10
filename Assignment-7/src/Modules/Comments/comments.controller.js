import { Router } from "express";
import * as commentService from "./comments.service.js";

const router = Router();
router.post("/", commentService.createBulkComments);
router.patch("/:commentId", commentService.updateComment);
router.post("/find-or-create", commentService.findOrCreateComment);
router.get("/search", commentService.searchComments);
router.get("/newest/:postId", commentService.getNewestComments);
router.get("/details/:id", commentService.getCommentDetails);

export default router;
