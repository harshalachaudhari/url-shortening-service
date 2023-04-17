import { Document, Model } from "mongoose";

//Below interface represent a document of Url model in DB
export interface IUrlDetails {
    urlId: string;
    userId?: number;
    longUrl: string;
    shortUrl: string;
    clicks: number;
    date: Date;
}

export interface IUrlDocument extends IUrlDetails, Document { }
export interface IUrlModel extends Model<IUrlDocument> { }
