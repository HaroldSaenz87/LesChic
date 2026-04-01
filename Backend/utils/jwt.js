import jwt from 'jsonwebtoken'

export const generateJWT = (uid, additional={}, type) => {

    return new Promise((resolve, reject)=>{

        const payload = { uid, ...additional, type }

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '1d'
        }, (error, token)=>{
            if(error){
                console.log(error);
                reject('Cannot generate token')
            }

            resolve(token)

        })

    })

}