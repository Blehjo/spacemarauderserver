const { Schema, model } = require('mongoose');

const paintingSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Date,
      required: true,
      trim: true,
    },
    medium: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    photo: {
        type: String,
        required: true,
    },
    collection: {
        type: Schema.Types.ObjectId,
        ref:'Collection'
    },
})

const Painting = model('Painting', paintingSchema);

module.exports = Painting;