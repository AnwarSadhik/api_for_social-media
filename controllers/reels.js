import { uploadFile } from "../helper/aws.js"
import path from "path"
import Reels from "../models/reelsModel.js"
import User from "../models/userModel.js"

export const uploadReel = async(req, res) => {
    try {
        const file = req.files[0]

        if (!file) {
            return res.status(400).json({ message: "Select a video file" })
        }

        const allowedExtensions = [".mp4", ".mkv",".avi"];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        // console.log(file.originalname)

        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ message: "Invalid format Please select a video" });
        }
        let {caption="", video, userId} = req.body
        
        const s3Link = await uploadFile(file)
        const newReel = Reels({
            video: s3Link,
            caption:  caption,
            userId: req.user._id
        })

        await newReel.save();
        return res.status(201).json({ success: true, data: newReel });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const editReel = async(req, res) => {
    try {
        const { reelId } = req.params;
        const reelExits = await Reels.findById(reelId)

        if (!reelExits) {
            return res.status(404).json({ message: "Reel not found" });
        }

        reelExits.caption = req.body.caption;
        await reelExits.save();
        
        return res.status(200).json({ data: reelExits });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const viewReel = async(req, res) => {
    try {
        const { reelId } = req.params;
        const reelExits = await Reels.findById(reelId)

        if (!reelExits) {
            return res.status(404).json({ message:"Reel not found"});
        }

        return res.status(200).json({success: true, data: reelExits });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const getOwnReels = async(req, res) => {
    try {
        const userId = req.user._id;
        const myreels = await Reels.find({userId : userId});

        if (!myreels) {
            return res.status(404).json({ error:"No reels uploaded"});
        }

        return res.status(200).json({ data: myreels });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const getAllReels = async(req, res) => {
    try {
        const allReels = await Reels.find();

        if (!allReels) {
            return res.status(404).json({"message": "No Reels found"});
        }

        return res.status(200).json({ reels: allReels });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const addAView = async(req, res) => {
    try {
        await Reels.findByIdAndUpdate(req.params.reelId,{
            $inc: { views: 1 }
        });
        res.status(200).json({success: true, message:"The view has been increased."});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const likeAReel = async(req, res) => {
    try {
        const { reelId } = req.params;
        const id = req.user._id;
        const reelExits = await Reels.findById(reelId);
        
        if (!reelExits) {
            return res.status(404).json({message: "Reel not found"});
        }
        if (reelExits.likes.includes(id.toString())) {
            return res.status(400).json({ message: "You already liked this reel." });
          }
        await Reels.findByIdAndUpdate(reelId, { $push: { likes: id }})
        return res.status(201).json({message:"like added"});
    } catch (error) {
        return res.status(500).json({message: error.message});   
    }
        
}
export const removeALike = async(req, res) => {
    try {
        const { reelId } = req.params;
        const id = req.user._id;
        const reelExits = await Reels.findById(reelId);
        
        if (!reelExits) {
            return res.status(404).json({message: "Reel not found"});
        }
    
        await Reels.findByIdAndUpdate(reelId, { $pull: { likes: id }})
        return res.status(200).json({message:"like Removed"});
    } catch (error) {
        return res.status(500).json({message: error.message});   
    }
}
export const getTrendingReels = async(req, res) => {
    try {
        const trending = await Reels.find().sort({ views: -1 })

        return res.status(200).json({data: trending});

    } catch (error) {
        return res.status(500).json({message: error.message});   
    }
}
export const deleteAReel = async(req, res) => {
    try {
        const { reelId } = req.params;
        const userId = req.user._id;
        const reelExits = await Reels.findById(reelId)

        if (reelExits.userId.toString() === userId.toString()) {
            await Reels.findByIdAndDelete(reelId)
            return res.status(200).json({ message: "Reel deleted successfully"})
        } 

        return res.status(400).json({ message: "You do not have permission to delete this Reel"});

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }

}
export const saveReel = async(req, res) => {
    try {
        const { reelId } = req.params;
        const reelExits = await Reels.findById(reelId);
        const currentUser = await User.findById(req.user._id);

        if (!reelExits) {
            return res.status(404).json({ message: "Reel not found"})
        }

        if (currentUser.savedReels.toString().includes(reelId.toString())) {
            return res.status(400).json({ message: "You already saved this Reel!" })
        }

        await User.findByIdAndUpdate(currentUser, { $push: { savedReels: reelId } })
        return res.status(200).json({ success: true,message: "Reel saved successfully"})

    } catch (error) {
        return res.status(500).json({ error: error.message})
    }
}
export const unSaveReel = async(req, res) => {
    try {
        const { reelId } = req.params;
        const reelExits = await Reels.findById(reelId);
        const currentUser = await User.findById(req.user._id);

        if (!reelExits) {
            return res.status(404).json({ message: "Reel not found"})
        }

        await User.findByIdAndUpdate(currentUser, { $pull: { savedReels: reelId } })
        return res.status(200).json({ success: true,message: "Reel removed from saved"})

    } catch (error) {
        return res.status(500).json({ error: error.message})
    }
}