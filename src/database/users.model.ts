
import mongoose from 'mongoose';
import { IUserDocument } from './users.types'

const userSchema = new mongoose.Schema<IUserDocument>({
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    lastLoginTime: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model<IUserDocument>('User', userSchema);