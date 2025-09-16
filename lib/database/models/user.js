import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcryptjs';

const modelName = 'Use';
//===========================
const AuthorizationSchema = new Schema({
    verifyCode: String,
    expireDate: Date,
    failed: {type: Number, default: 0},
    verifyCodeType: String
}, {_id: false});

const schema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    authorization: AuthorizationSchema,
    name: {
        type: String,
        trim: true
    }
}, {timestamps: true, collection: modelName, toJSON: {virtuals: true}});
// ======================
// generating a hash
schema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.authorization.verifyCode = await bcrypt.hash(this.authorization.verifyCode, salt);
        next();
    } catch (error) {
        next(error);
    }

})

schema.methods.compareCode = async function (code) {
    try {
        return await bcrypt.compare(code, this.authorization.verifyCode)
    } catch (e) {
        throw e
    }
}

export default mongoose.model(modelName, schema)
