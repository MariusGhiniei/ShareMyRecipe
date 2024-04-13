const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
         required: true
    },
    content: { 
        type: String, 
        required: true,
    },
    imageUrl: {
        type: String,
        required: false
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
})

module.exports = mongoose.model('Post', postSchema)