const Attraction = require('../models/attraction');
const cloudinary = require('../cloudinary');
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mapboxGeocoding({accessToken: mapboxToken});

module.exports.index = async (req, res) => {
    const attractions = await Attraction.find({});
    res.render('attractions/index', {attractions});
}

module.exports.renderNewForm = (req, res) => {
    res.render('attractions/new');
}

module.exports.createAttraction = async(req, res, next) => {
    const attraction = new Attraction(req.body.attraction);
    const geoData = await geocoder.forwardGeocode({
        query: attraction.location,
        limit: 1
    }).send();
    attraction.geometry = geoData.body.features[0].geometry;
    attraction.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    attraction.author = req.user._id;
    await attraction.save();
    console.log(attraction);
    req.flash('success', 'Succeessfully made a new attraction');
    res.redirect(`/attractions/${attraction._id}`);
}

module.exports.attractionDetail = async (req, res) => {  
    //populate to get full datas under the '' array
    const attraction = await (await Attraction.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    if(!attraction){
        req.flash('error', 'Attraction not found!');
        return res.redirect('/attractions');
    }
    res.render('attractions/detail', {attraction});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const attraction = await Attraction.findById(id);
    if(!attraction){
        req.flash('error', 'Attraction not found!');
        return res.redirect('/attractions');
    }
    res.render('attractions/edit', {attraction});
}

module.exports.attractionUpdate = async (req, res) => {
    const {id} = req.params;
    const attraction = await Attraction.findByIdAndUpdate(id, {...req.body.attraction});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    attraction.images.push(...imgs);
    await attraction.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await attraction.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated attraction!');
    res.redirect(`/attractions/${attraction._id}`);
}

module.exports.attractionDelete = async (req, res) => {
    const {id} = req.params;
    await Attraction.findByIdAndDelete(id);
    req.flash('success', 'Attraction deleted!')
    res.redirect('/attractions');
}