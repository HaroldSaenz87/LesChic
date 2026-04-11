/*
    Routes for Auth
    host + /api/clothes
*/
import { Router } from 'express';

import Clothes from '../models/Clothes.js';
import List from '../models/List.js';
import { jwtValidator } from '../middlewares/jwt-validator.js';
import { uploadImage } from '../utils/uploadImage.js';
import { deleteImage } from '../utils/deleteImage.js';

const router = Router();

//middleware for all clothes
router.use(jwtValidator)

// insert new item
router.post('/', uploadImage.single("image"), async(req, res)=>{

    try {
        const clothes = new Clothes({...req.body, lastUsed: new Date()})
        // get image path
        const imagePath = req.file ? `/images/${req.file.filename}` : "/images/default.jpg";
        // update values
        clothes.userId = req.uid
        clothes.imagePath = imagePath
        const newClothes = await clothes.save()
        await newClothes.populate("tags", "title");

        res.json({
            ok: true,
            clothes: newClothes
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error while saving item'
        })
    }
})

// Get all clothes
router.get('/', async(req, res)=>{
    try {
        const { uid } = req
        const clothes = await Clothes.find({ userId: uid }).populate("tags", "title")
        res.json({
            ok: true,
            clothes
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error while retrieving clothes'
        })
    }
})

// get a single item
router.get("/:id", async (req, res) => {
    try {
        const { uid } = req;
        const { id } = req.params;

        const clothes = await Clothes.findOne({
            _id: id,
            userId: uid
        }).populate("tags", "title");

        if (!clothes) {
        return res.status(404).json({
            ok: false,
            msg: "Clothes item not found"
        });
        }

        res.json({
            ok: true,
            clothes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error retrieving clothes item"
        });
    }
});

// update a single item
router.put("/:id", async (req, res) => {
    try {
        const { uid } = req;
        const { id } = req.params;

        const updatedClothes = await Clothes.findOneAndUpdate(
        { _id: id, userId: uid }, req.body,
        { returnDocument: 'after', runValidators: true }
        ).populate("tags", "title");

        if (!updatedClothes) {
        return res.status(404).json({
            ok: false,
            msg: "Clothes item not found"
        });
        }

        res.json({
            ok: true,
            clothes: updatedClothes,
            msg: "Clothes item successfully updated"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error updating clothes item"
        });
    }
});

// delete a single item
router.delete("/:id", async (req, res) => {
    try {
        const { uid } = req;
        const { id } = req.params;

        const deleted = await Clothes.findOneAndDelete({
            _id: id,
            userId: uid
        });

        if (!deleted) {
            return res.status(404).json({
                ok: false,
                msg: "Clothes item not found"
            });
        }

        // delete referenced image
        deleteImage(deleted.imagePath);

        // Make sure to update existing lists
        await List.updateMany(
            { clothes: id },
            { $pull: { clothes: id } }
        );

        res.json({
            ok: true,
            msg: "Clothes item deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error deleting clothes item"
        });
    }
});

export default router;