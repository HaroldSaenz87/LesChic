/*
    Routes for Auth
    host + /api/clothes
*/
import { Router } from 'express';

import Clothes from '../models/Clothes.js';
import { jwtValidator } from '../middlewares/jwt-validator.js';

const router = Router();

//middleware for all events
router.use(jwtValidator)

// insert new item
router.post('/', async(req, res)=>{

    const clothes = new Clothes(req.body)

    //TODO: upload image and generate path

    try {
        clothes.userId = req.uid
        const newClothes = await clothes.save()

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

        // TODO: delete referenced image

        // FUTURE IMPLEMENT
        // Make sure to update existing lists

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