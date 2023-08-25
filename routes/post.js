import express from "express";
import {
  addView,
  createPost,
  deletePost,
  getAllPost,
  getOwnPosts,
  // search,
  singlePost,
  trandVideos,
  updatePost,
  savePost,
  unSavePost,
} from "../controllers/post.js";
import { checkAuth } from "../middlewares/userAuth.js";


const router = express.Router();

// create and update posts
router.post("/create", checkAuth,createPost);
router.put("/update/:postId", checkAuth, updatePost);

//delete post
router.delete("/delete/:id", checkAuth, deletePost);

// get posts 
router.get("/single/:postId", singlePost);
router.get("/myPosts", checkAuth, getOwnPosts);
router.get("/all", getAllPost);

// trends and most views
router.get("/trending", trandVideos);
router.get("/view/:id", addView);
// router.get("/search", search);

// save and unsave 
router.put("/save/:postId",checkAuth,savePost)
router.put("/unSave/:postId",checkAuth,unSavePost)

export { router as postRoutes };
