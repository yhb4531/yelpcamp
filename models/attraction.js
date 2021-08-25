const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/h_75,w_100');
});
//to use this virtual 'thumbnail', replace url to thumbnail in ejs files

const opts = {toJSON: {virtuals: true}};

const AttractionSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

AttractionSchema.virtual('properties.popUpMarkUp').get(function(){
    return `
        <strong><a href="/attractions/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,20)}</p>
        `
})

AttractionSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Attraction', AttractionSchema);