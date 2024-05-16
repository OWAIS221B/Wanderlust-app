const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,

    image: {
        type: String,
        default: 'https://in.pinterest.com/pin/141793088257583329/',
        set: (v) => v === '' ? 'https://in.pinterest.com/pin/141793088257583329/' : v
    },
    price: Number,
    location: String,
    country: String
})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing