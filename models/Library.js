const { Schema, model } = require('mongoose');

const librarySchema = new Schema({
    libraryName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    paintings: [
        {
            type: Schema.Types.ObjectId,
            ref:'Painting'
        },
    ],
})

const Library = model('Library', librarySchema);

module.exports = Library;