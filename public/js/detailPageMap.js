mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: attraction.geometry.coordinates, // starting position [lng, lat]
zoom: 11 // starting zoom
});

new mapboxgl.Marker({color: 'black'})
    .setLngLat(attraction.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 30})
        .setHTML(
            `
            <h3>${attraction.title}</h3>
            <p>${attraction.location}</p>
            `
        )
    )
    .addTo(map);
