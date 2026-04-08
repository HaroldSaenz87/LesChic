/*
    Routes for Auth
    host + /api/lists
*/

import { Router } from 'express';

import List from '../models/List.js';
import { jwtValidator } from '../middlewares/jwt-validator.js';

const router = Router();

//middleware for all lists
router.use(jwtValidator)

// create new list
router.post("/", async(req, res) => {
    try {
        const { uid } = req;
        const { clothes } = req.body;

        if(!clothes || clothes.length==0){
            return res.status(400).json({
                ok: false,
                msg: 'Missing clothes array or empty'
            })
        }

        const list = new List(req.body);

        list.userId = uid;
        list.lastUsed = new Date(0)
        list.plannedUsed = new Date(0)
        const newList = await list.save();
        await newList.populate("clothes", ["imagePath", "title"])

        return res.json({
            ok: true,
            lists: newList
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error while creating List'
        })
    }
})

// get all lists of a user
router.get("/", async (req, res) => {
    try {
        const { uid } = req
        const lists = await List.find({ userId: uid }).populate("clothes", ["imagePath", "title"])
        return res.json({
            ok: true,
            lists
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error while retrieving Lists'
        })
    }
})

// update a single list
router.put("/:id", async (req, res) => {
    try {
        const { uid } = req;
        const { id } = req.params;
        const { clothes } = req.body;

        if(!!clothes && clothes.length==0){
            return res.status(400).json({
                ok: false,
                msg: 'Clothes array empty'
            })
        }

        const updatedList = await List.findOneAndUpdate(
        { _id: id, userId: uid }, req.body,
        { returnDocument: 'after', runValidators: true }
        ).populate("clothes", ["imagePath","title"]);

        if (!updatedList) {
        return res.status(404).json({
            ok: false,
            msg: "List item not found"
        });
        }

        res.json({
            ok: true,
            lists: updatedList,
            msg: "List successfully updated"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error updating clothes item"
        });
    }
});

// delete single list
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const list = await List.findById(id);
        if (!list || list.userId != req.uid) {
        return res.status(400).json({
            ok: false,
            msg: "List not found or forbidden"
        });
        }

        await List.findByIdAndDelete(id);

        return res.json({
            ok: true,
            msg: "List deleted"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error deleting list"
        });
    }
});

export default router;