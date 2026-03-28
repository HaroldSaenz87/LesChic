import jwt from 'jsonwebtoken'

export const jwtValidator = (req, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No token found on the request'
        })
    }

    try {

        const payload = jwt.verify(token, process.env.SECRET_JWT_SEED)

        req.uid = payload.uid
        req.email = payload.email

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }

    next()
}