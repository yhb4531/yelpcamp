const mongoose = require('mongoose');
const Campground = require('../models/attraction');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB =async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * cities.length);
        const camp = new Campground({
            author: '611dec4617461a3eace17042',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque itaque consequuntur numquam voluptatibus cupiditate accusamus eum, sit temporibus dicta, aliquam architecto officia facere, cum mollitia nihil harum? Aperiam, quod eius.',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ehyoo/image/upload/v1629523762/CRUD_Project/hij5zot30gwetjupbcns.jpg',
                    filename: 'CRUD_Project/hij5zot30gwetjupbcns'
                },
                {
                    url: 'https://res.cloudinary.com/ehyoo/image/upload/v1629523764/CRUD_Project/jtpigo6vbigefnqp9at9.jpg',
                    filename: 'CRUD_Project/jtpigo6vbigefnqp9at9'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})