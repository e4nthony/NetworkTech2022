import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {         //encrypted password
        type: String,
        required: true
    },
    refresh_tokens: {   //  multiple tokens for multiple devices
        type: [String]
    }
});

export = mongoose.model('User', userSchema);