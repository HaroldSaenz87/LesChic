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

router.post('/', async(req, res)=>{

    const clothes = new Clothes(req.body)

    //TODO: upload image and generate path

    try {
        clothes.userId = req.uid
        const newClothes = await clothes.save()

        res.json({
            ok: true,
            newItem: newClothes
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error while saving item'
        })
    }
})

export default router;