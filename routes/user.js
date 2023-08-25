import express from "express";
import {
  dislike,
  getInfo,
  getSingleUser,
  like,
  updatePicture,
  updateProfile,
  uploadImage,
  deleteUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  search,
} from "../controllers/user.js";
import { checkAuth } from "../middlewares/userAuth.js";

const router = express.Router();


// upload and update profileImg
router.put('/uploadProfile/:userId', checkAuth,uploadImage);
router.put("/updateProfile/:userId", checkAuth, updatePicture);

// getUser and search User
router.get("/getMe", checkAuth, getInfo);
router.get("/info/:id",checkAuth,getSingleUser);

//delete user
router.delete("/delete/:userId", checkAuth, deleteUser);

// update profile
router.patch("/updateProfile/:userId", checkAuth, updateProfile);

// like and disLike a post
router.put("/like/:postId", checkAuth, like);
router.put("/dislike/:postId", checkAuth, dislike);

// fin/search a user
router.get("/search", checkAuth, search);

// Follow and Unfollow router
router.put("/follow",checkAuth,followUser);
router.put("/unfollow",checkAuth,unfollowUser);
router.get("/getAllFollowers/:userId",checkAuth,getFollowers)
router.get("/getAllFollowing/:userId",checkAuth,getFollowing)


export { router as userRoutes };
