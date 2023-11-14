const publicArtUrl = 'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-art/exports/geojson?lang=en&timezone=America%2FLos_Angeles'

function addDataToMap(data) {
    var markers = L.markerClusterGroup({
        disableClusteringAtZoom: 17
    });
    markers.addLayer(
        L.geoJSON(data, {
        filter: filter,
        onEachFeature: onEachFeature
    }))
    map.addLayer(markers)
}
fetch(publicArtUrl).then(response => {
    return response.json()
}).then(data => addDataToMap(data)) 

var map = L.map('map').setView([49.28290750560059, -123.12051391364608], 13);

// Add a tile layer (you can choose a different provider)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function onEachFeature(feature, layer) {
    [title_of_work, ownership, url] = [feature.properties.title_of_work, feature.properties.ownership, feature.properties.url]
    popupText = `<b>${title_of_work}</b> <br> ${ownership ?? ''}`
    if (feature.properties.photourl != null) { // add photo id url
        photoId = feature.properties.photourl.id
        popupText += `<br><img src='https://opendata.vancouver.ca/explore/dataset/public-art/files/${photoId}/300/' style='float:left;width:100%; max-height:500px; object-fit: cover;'/>`
    }
    popupText += `<a href="${url}" target="_blank">More Info</a>`
    layer.bindPopup(popupText, {
        maxHeight: 560
    })
    layer.bindTooltip(feature.properties.title_of_work)
}

// Filter out artwork that has been removed
function filter(geoJsonFeature) {
    result = (geoJsonFeature.properties.status == 'In place') ? true : false;
    return result
}

// Locate user (Need HTTPS host)
L.control.locate().addTo(map)
