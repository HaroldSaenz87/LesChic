/*
    Routes for Auth
    host + /api/auth
*/
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { generateJWT } from '../utils/jwt.js';

const router = Router();

router.post('/register', async(req, res)=>{
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                ok: false,
                msg: 'User already registered with that email'
            })
        }

        user = new User(req.body)

        //HASH password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt)

        await user.save()

        //send email with token to verify email
        //Generate JWT
        const emailToken = await generateJWT(user._id, user.email, "email-verification")
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`
        await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Verify your email</h2>
            <p>Hello ${user.name},</p>
            <p>Thanks for registering. Please click the button below to verify your email address:</p>
            <a href="${verificationLink}"
                style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
                Verify Email
            </a>
            <p style="margin-top:16px;">Or copy and paste this link into your browser:</p>
            <p>${verificationLink}</p>
            <p>This link will expire in 1 day.</p>
            </div>
        `,
        });

        res.status(201).json({
            ok: true,
            msg: 'User registered successfully. Verification email sent.'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error on register'
        })
    }
})

router.post('/verify-email', async(req, res)=>{
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: "Verification token is required",
            });
        }

        //check token
        let decoded;
        try {
        decoded = jwt.verify(token, process.env.SECRET_JWT_SEED);
        } catch (err) {
        return res.status(400).json({
            ok: false,
            msg: "Invalid or expired verification token",
        });
        }

        if (decoded.type !== "email-verification") {
            return res.status(400).json({
                ok: false,
                msg: "Invalid token type",
            });
        }

        const user = await User.findById(decoded.uid);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: "User not found",
            });
        }

        //update user account params
        user.isEmailVerified = true;
        await user.save();
        return res.status(200).json({
            ok: true,
            msg: "Email verified successfully",
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Server error during email verification",
        });
    }
})

router.post('/login', async(req, res)=>{
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(!user || !user.isEmailVerified){
            return res.status(400).json({
                ok: false,
                msg: 'Cannot find a user with that email or email not verified'
            })
        }

        //Check password
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'No valid password'
            })
        }

        //Generate JWT
        const token = await generateJWT(user._id, user.email, "login-verification")

        res.status(200).json({
            ok: true,
            msg: 'login',
            uid: user._id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error on login'
        })
    }
})

router.post('/forgot-password', async(req, res)=>{
    //TODO: send email with token to reset password
})

router.post('/reset-password', async(req, res)=>{
    //TODO: decode JWT and update password (hash)
})


export default router;