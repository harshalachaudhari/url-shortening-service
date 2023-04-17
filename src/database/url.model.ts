import mongoose from 'mongoose';
import { IUrlDetails } from './url.types';


const UrlSchema = new mongoose.Schema<IUrlDetails>({
    urlId: {
        type: String,
        required: true,
    },
    userId: { type: String },
    longUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IUrlDetails>('Url', UrlSchema);    