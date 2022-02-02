var map = L.map("map", {
    minZoom: 0,
    maxZoom: 2,
    crs: L.CRS.Simple,
}).setView([ 0, 0 ], 1); //setView([lat, long], default zoom level)

var pokeballIcon = L.icon({
    iconUrl: "https://www.serebii.net/pokearth/hisui/icons/pokeball.png",
    iconSize: [ 32, 32 ], // size of the icon
    iconAnchor: [ 16, 16 ], // point of the icon which will correspond to marker's location
});

var alphaIcon = L.icon({
    iconUrl: "https://www.serebii.net/pokearth/hisui/icons/alpha.png",
    iconSize: [ 32, 32 ],
    iconAnchor: [ 16, 16 ],
});

var distIcon = L.icon({
    iconUrl: "https://www.serebii.net/pokearth/hisui/icons/distortion.png",
    iconSize: [ 32, 32 ],
    iconAnchor: [ 16, 16 ],
});

var treeIcon = L.icon({
    iconUrl: "https://www.serebii.net/pokearth/hisui/icons/tree.png",
    iconSize: [ 32, 32 ],
    iconAnchor: [ 16, 16 ],
});

var crystalIcon = L.icon({
    iconUrl: "https://www.serebii.net/pokearth/hisui/icons/crystal.png",
    iconSize: [ 32, 32 ],
    iconAnchor: [ 16, 16 ],
});

var eventIcon = L.icon({
    iconUrl: "https://www.serebii.net/pokearth/hisui/icons/event.png",
    iconSize: [ 32, 32 ],
    iconAnchor: [ 16, 16 ],
});

var southWest = map.unproject([0, 2048], map.getMaxZoom());
var northEast = map.unproject([2048, 0], map.getMaxZoom());
map.setMaxBounds(new L.LatLngBounds(southWest, northEast));