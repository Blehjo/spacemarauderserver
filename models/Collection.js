const { Schema, model } = require('mongoose');

const collectionSchema = new Schema({
    collectionName: {
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

const Collection = model('Collection', collectionSchema);

module.exports = Collection;