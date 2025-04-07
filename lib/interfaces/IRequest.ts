import { IUserDocument } from "@root/models/User";
import { NextApiRequest } from "next";

export interface GaurdedRequest extends NextApiRequest{
    user: IUserDocument;
}