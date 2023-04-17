import { Document, Model } from "mongoose";

//Below interface represent a document in DB
export interface IUser {
    email: string;
    password: string;
    name?: string;
    isAdmin: boolean;
    lastLoginTime?: Date;
}


export interface IUserDocument extends IUser, Document { }
export interface IUserModel extends Model<IUserDocument> { }