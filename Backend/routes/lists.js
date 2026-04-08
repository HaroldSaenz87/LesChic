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


export default router;