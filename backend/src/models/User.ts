import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        }
    },
    {
        timestamps: true
    }
)

UserSchema.pre<IUser> ("save", async function () {
    if (!this.isModified("password")) return;

    try {
        const saltRounds = 10;
        const hashed = await bcrypt.hash(this.password, saltRounds);
        this.password = hashed;
    }
    catch(err) {
        console.error("error in presave: ", err);
        throw err;
    }
})

UserSchema.methods.comparePassword = function (this: IUser, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password); 
}

UserSchema.methods.toJson = function (this: IUser) {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

export default mongoose.model<IUser>("User", UserSchema);