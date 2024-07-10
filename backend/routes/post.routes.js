import express from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import {
  createPost,
  deletePost,
  commentOnPosts,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllPosts);
router.get("/following-post", protectRoute, getFollowingPosts);
router.get("/user-post/:username", protectRoute, getUserPosts);
router.get("/likes/:userId", protectRoute, getLikedPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:postId", protectRoute, likeUnlikePost);
router.post("/comment/:postId", protectRoute, commentOnPosts);
router.delete("/:id", protectRoute, deletePost);

export default router;
