import { GaurdedRequest } from '@root/lib/interfaces/IRequest';
import { withRoleGuard } from '@root/lib/middlewares/withRoleGuard';
import User from '@root/models/User';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method not allowed' });
        }
        const { email, otp } = req.body;
        const user = (req as GaurdedRequest).user;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        if(user.email !== email) {
            return res.status(403).json({ message: "User Not Created" });
        }
        // Check if the OTP is valid and not expired
        const Otpuser = await User.findById(user._id).select("+otp");
        if (!Otpuser || !Otpuser.otp || Otpuser.otp.value !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        Otpuser.emailVerified = true;
        Otpuser.otp = null; // Clear the OTP after verification
        await Otpuser.save();
        return res.status(200).json({ message: 'Email verified successfully' });

    } catch (error) {
        console.error("Error in verify-email-otp:", error);
        return res.status(500).json({ message: "Internal Server Error" });       
    }
}

export default withRoleGuard(handler, ["User"]);