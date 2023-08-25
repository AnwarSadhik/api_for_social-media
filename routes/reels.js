import express from "express";
import {
    uploadReel,
    editReel,
    viewReel,
    getAllReels,
    getOwnReels,
    addAView,
    likeAReel,
    removeALike,
    getTrendingReels,
    deleteAReel,
    saveReel,
    unSaveReel
} from "../controllers/reels.js"
import { checkAuth } from "../middlewares/userAuth.js";

const router = express.Router();

router.post('/upload',checkAuth,uploadReel);
router.patch("/edit/:reelId",checkAuth,editReel);
router.get("/view/:reelId",viewReel);
router.get("/myReels",checkAuth,getOwnReels);
router.get("/allReels",checkAuth, getAllReels);
router.put("/addView/:reelId",addAView);
router.put("/like/:reelId",checkAuth,likeAReel);
router.put("/removeLike/:reelId",checkAuth,removeALike);
router.get("/trending",checkAuth,getTrendingReels);
router.delete("/delete/:reelId",checkAuth,deleteAReel);
router.put("/save/:reelId",checkAuth,saveReel);
router.put("/unSave/:reelId",checkAuth,unSaveReel);


export { router as reelsRoutes };