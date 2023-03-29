import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    // _id: {                 //a lot of errors
    //     type: String,
    //     required: false
    // },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    password: {         //encrypted password
        type: String,
        required: true
    },
    refresh_tokens: {   //  multiple tokens for multiple devices
        type: [String],
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    }
});

export = mongoose.model('User', userSchema);