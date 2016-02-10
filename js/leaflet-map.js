var map = L.map('map').setView([40.71,-73.93], 11);

// IMPORT MAP TILE
var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// MAP TILES FROM CARTODB
map.addLayer(layer);

//  GLOBAL VARIABLES
var wifiHotspotsGeoJSON; 

// let's add neighborhood data
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

    console.log(neighborhoods);

    // neighborhood choropleth map
    // let's use % in poverty to color the neighborhood map
    var povertyStyle = function (feature){
        var value = feature.properties.PovertyPer;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
            fillColor = "#e6d6d9";
        }
        if(value >0.1 && value <=0.15){
            fillColor = "#fca7a1";
        }
        if(value >0.15 && value<=0.2){
            fillColor = "#fc6972";
        }
        if(value > 0.2 && value <=0.3){
            fillColor = "#f2504a";
        }
        if(value > 0.3 && value <=0.4) { 
            fillColor = "#de1f16";
        }
        if(value > 0.4) { 
            fillColor = "#a5070d";
        }

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };

        return style;
    }

    var povertyClick = function (feature, layer) {
        var percent = feature.properties.PovertyPer * 100;
        percent = percent.toFixed(0);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Percent in Poverty: </strong>" + percent + "%");
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: povertyStyle,
        onEachFeature: povertyClick
    }).addTo(map);


    // create layer controls
    createLayerControls(); 

});

$.getJSON("geojson/wifi-hotspots.geojson", function ( data ){
	var wifiData = data; 
	
	var wifiToLayer = function (feature, latlng) {
	    var wifiMarker = L.circle(latlng, 100, {
	        stroke: 1, 
	        weight: 0.2,
	        fillColor: "#41fa13", 
	        fillOpacity: 1
	    });
    	return wifiMarker;
	}

	var wifiStyle = {
		"color": "#f11513"
	};

	var wifiClick = function ( feature, layer ){
		console.log(feature.properties.name);
		layer.bindPopup("<strong>Name: </strong>" + feature.properties.name + "<br />" + "<strong>Address: </strong>" + feature.properties.location );
	};

	wifiHotspotsGeoJSON = L.geoJson(wifiData, {
		style: wifiStyle, 
		pointToLayer: wifiToLayer,
		onEachFeature: wifiClick
	}).addTo(map);
});

function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": layer
    };

    var overlayMaps = {
    	"Povery Map": neighborhoodsGeoJSON,
        "Wi-fi Spots": wifiHotspotsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);
}

