// Send otp to the requested email

import { GaurdedRequest } from '@root/lib/interfaces/IRequest';
import { withRoleGuard } from '@root/lib/middlewares/withRoleGuard';
import User from '@root/models/User';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from "nodemailer"

const otpExpiry = 5 * 60 * 1000; // 5 minutes

const Subject = "OTP Verification for Your Account";
const Message = "Your OTP is: ";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        const { email } = req.body;
        const user = (req as GaurdedRequest).user;
        
        if(user.email !== email) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const Otpuser = await User.findOne({ email: email });

        if (!Otpuser) {
            return res.status(403).json({ message: "User Not Created" });
        }

        // Generate a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        Otpuser.otp = {
            value: otp,
            expiresIn: new Date(Date.now() + otpExpiry),
        };
        await Otpuser.save();

        // Send the OTP to the user's email using nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: false, // Force non-secure connection
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            name: process.env.EMAIL_FROM_NAME,
            tls: {
                rejectUnauthorized: false // Only use this in development
            }
        })

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_FROM || email,
            to: email,
            subject: `${Subject}`,
            // text: `${Message} ${otp}`,
            html: `<p>${Message} <strong>${otp}</strong></p>`,
        }

        // Send email
        await transporter.sendMail(mailOptions)




        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default withRoleGuard(handler,["User"]);