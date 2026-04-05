/*
    Routes for Auth
    host + /api/tags
*/
import { Router } from 'express';

import Tag from '../models/Tag.js';
import Clothes from '../models/Clothes.js';
import { jwtValidator } from '../middlewares/jwt-validator.js';

const router = Router();

//middleware for all tags
router.use(jwtValidator)

// create a single tag
router.post("/", async (req, res) => {
    try {
        const { title } = req.body;

        const existingTag = await Tag.findOne({
            title: title.trim(),
            userId: req.uid
        });

        if (existingTag) {
        return res.status(400).json({
            ok: false,
            msg: "Tag already exists"
        });
        }

        const tag = new Tag({ title: title.trim(), userId: req.uid });
        await tag.save();

        res.status(201).json({
            ok: true,
            tag
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error creating tag"
        });
    }
});

// get all tags of a user
router.get("/", async (req, res) => {
    try {
        const tags = await Tag.find({ userId: req.uid }).sort({ title: 1 });

        res.json({
            ok: true,
            tags
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error retrieving tags"
        });
    }
});

// delete single tag
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const tag = await Tag.findById(id);
        if (!tag || tag.userId != req.uid) {
        return res.status(400).json({
            ok: false,
            msg: "Tag not found or forbidden"
        });
        }

        await Clothes.updateMany(
            { tags: id },
            { $pull: { tags: id } }
        );

        await Tag.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Tag deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error deleting tag"
        });
    }
});

export default router;
