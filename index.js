require('dotenv').config();

const Feeds = require('pusher-feeds-server');

const express = require('express');
const cookieParser = require('cookie-parser');
const uuidv4 = require('uuid/v4');
const path = require('path');
const request = require('request');

const app = express();
const feeds = new Feeds({
	instanceId: process.env.FEEDS_INSTANCE_ID,
	key: process.env.FEEDS_KEY,
});

const fixedPath = [
	{ lat: 51.503908, lng: -0.149131 },
	{ lat: 51.506102, lng: -0.144281 },
	{ lat: 51.508479, lng: -0.138659 },
	{ lat: 51.509601, lng: -0.135226 },
	{ lat: 51.510353, lng: -0.138123 },
	{ lat: 51.512603, lng: -0.140247 },
	{ lat: 51.514005, lng: -0.141556 },
	{ lat: 51.515434, lng: -0.141996 },
	{ lat: 51.517010, lng: -0.142694 },
	{ lat: 51.519239, lng: -0.144539 },
	{ lat: 51.520715, lng: -0.145108 },
	{ lat: 51.522123, lng: -0.145741 },
	{ lat: 51.523252, lng: -0.147725 },
	{ lat: 51.524807, lng: -0.148412 },
	{ lat: 51.523992, lng: -0.152843 },
	{ lat: 51.524326, lng: -0.157381 },
	{ lat: 51.526102, lng: -0.159677 }
];

// Get express to use the cookie parser middleware
app.use(cookieParser());

// Create GET endpoint to access page
app.get('/', (req, res) => {
	let id = '';
	const cookie = req.cookies.user_id;

	if (cookie === undefined) {
		// Set User ID for this request
		id = uuidv4();

		// Cookie Options
		const options = {
			maxAge: 1000 * 60 * 60 * 24 * 365,
			httpOnly: false,
			signed: false,
		};

		// Set cookie
		res.cookie('user_id', id, options);
	} else {
		id = req.cookies.user_id;

	}

	res.sendFile(path.join(`${__dirname}/public/index.html`));

	// This is a minor hack in order to check if data has been published to the feed or noti
	request.get(`https://us1.pusherplatform.io/services/feeds/v1/${process.env.FEEDS_INSTANCE_ID.split(':')[2]}/feeds/maps-demo-${id}/items`, (error, response, body) => {
		const jsonRes = JSON.parse(body);

		const hasItems = jsonRes.items.length !== 0;
		if (hasItems) {
			console.log("Has items, not posting");
		} else {
			console.log("Doesn't have items, posting");
			postToFeeds(`maps-demo-${id}`, fixedPath);
		}
	});
});

app.use(express.static(path.join(`${__dirname}/public`)));

app.listen(process.env.PORT || 3000, () => {
	console.log('Feeds Realtime Map is Running.')
});


async function postToFeeds(feedName, data) {
	for (var i = 0; i < data.length; i++) {
		const path = data[i];

		// Start sending points to Feed instance
		feeds.publish(feedName, {
			lat: path.lat,
			lng: path.lng,
		}).then(() => {
			console.log("Item Published!");
		}).catch(err => {
			console.log(err.description)
		});

		await sleep(5000);
	}
}


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
