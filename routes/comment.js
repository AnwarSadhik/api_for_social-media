import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/comment.js";

import { checkAuth } from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/:postId", checkAuth, addComment);
router.delete("/:id", checkAuth, deleteComment);
router.get("/:postId", checkAuth, getComments);

export { router as commentRoutes };
