import User from "@root/models/User";
import { generateQRCode } from "@root/utils/qrcodeworks";
import { signUser } from "@root/utils/tokenWorks";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        const {firstName, lastName, email, mobile, /* gender, */ password} = req.body;
        // Check for password and confirmPassword


        if(!firstName || !lastName || !email || !mobile || !password){
            return res.status(400).json({error: "Please fill all the fields"});
        }

        // Check for existing User
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({error: "user already exists"})
        }
        
        // Create New User
        const newUser = new User({
            userName: email,
            profile: {
                firstName: firstName,
                lastName: lastName,
            },
            email,
            password,
            mobile,
            // gender,
            roles: ["User"],
        });

        // If user created save user to db
        if(newUser){
            signUser(newUser._id, newUser.roles, res);
            console.log("User signed up successfully");
            const qrData = {
                userId: newUser._id,
            }
            const qrcode = await generateQRCode(qrData);
            newUser.qrcode = qrcode ?? ""; // Assign the generated QR code to the user
            await newUser.save();
            res.status(201).json({message: "User created successfully", user: newUser});
        }else{
            res.status(400).json({error: "Invalid user data"});
        }

    }catch(error){
        if (error instanceof Error) {
            console.error("Error in signup controller", error.message);
            return res.status(400).json({error: error.message});
        }

        res.status(500).json({error: "Internal Server Error"});
        console.log("Error in signup controller", error);
    }
}