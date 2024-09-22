const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            default: new mongoose.Types.ObjectId(),
        },
        username: {
            type: String,
            required: [true, "Please enter your username!"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email!"],
            unique: true
        },
        password: {
            type: String,
            required: true
        },

    },
    {
        timestamps: true
    }

);

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    // Only hash if password is new or modified
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }


});

const User = mongoose.model('User', UserSchema);

module.exports = User;
