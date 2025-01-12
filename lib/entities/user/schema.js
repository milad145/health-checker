import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import {errorCode} from "../../modules/errorHandler.js";

const Schema = mongoose.Schema;
//===========================
const userSchema = new Schema({
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    status: {
        type: Number,
        default: 1,
        required: true,
        eval: [-1, 0, 1]
    },
    createdAt: Date,
    modifiedAt: Date
}, {collection: "user"});
// ======================
// generating a hash
userSchema.pre('save', async function (next) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10); // 10 is the number of rounds for the salt
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // If an error occurs, pass it to the next middleware
    }
})

// checking if password is valid
userSchema.methods.comparePassword = async (candidatePassword, password) => {
    try {
        let result = await bcrypt.compare(candidatePassword, password);
        if (result)
            return true
        else
            throw errorCode(2009)
    } catch (error) {
        throw error;
    }
};

export default userSchema;
