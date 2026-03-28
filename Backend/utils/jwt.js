import jwt from 'jsonwebtoken'

export const generateJWT = (uid, email, type) => {

    return new Promise((resolve, reject)=>{

        const payload = { uid, email, type }

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