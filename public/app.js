var map;
var poly;
var userid;

// Function that subscribes to the feed and defines what to do when items
// are received, along with how many to load in from the past.
// Set your instance ID below!
$(document).ready(function(){
	userid = getCookie("user_id");
	const feeds = new Feeds({
		instanceId: "v1:us1:7ddeab23-f18c-4692-a59e-ca69dc5b848a", // If you're testing locally, change this to your Feeds Instance ID
	});
	const feed = feeds.feed("maps-demo-"+userid);

	feed.subscribe({
		previousItems: 20,
		onOpen: () => {
			console.log("Feeds: Connection established");
		},
		onItem: item => {
			console.log("Feeds new item:", item.body.data);
			parseLocation(item);
		},
		onError: error => {
			console.error("Feeds error:", error);
		},
	});

	poly = new google.maps.Polyline({
		strokeColor: '#000000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});
	poly.setMap(map);
});

// Function that sets up a Google Map, centered on the first point the
// server provides.
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: { lat: 51.503908, lng: -0.149131 }
	});
}

//Function which adds a point to the map at latitude x, longitude y.
function addPoint(x,y) {
	var latlng = new google.maps.LatLng(x,y);
	var path = poly.getPath();
	path.push(latlng);
}

// Function which gets called when data is received. It adds the
// location to the list, and recenters the map.
function parseLocation(latlong) {
	var lat=latlong.body.data.lat;
	var long=latlong.body.data.lng;
	var latlng = new google.maps.LatLng(lat,long);
	addPoint(lat,long);
	map.panTo(latlng);
}

//W3Schools cookie function, used for user id
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
