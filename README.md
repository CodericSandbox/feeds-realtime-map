# Pusher Feeds Realtime Map Demo
Demo application showing how Feeds can be used to create realtime updating maps. Location data is sent to clients, and is then rendered on a map.

## Setting the project up

* Clone the repo
* Create .env file inside Server folder
* Add your FEEDS_INSTANCE_ID and FEEDS_KEY application key to .env. Your env should have 2 entries:
** FEEDS_INSTANCE_ID=<YOUR INSTANCE ID HERE>
** FEEDS_KEY=<YOUR FEEDS KEY HERE>
* Change your Feeds instance ID in Client/app.js 
* Change your Google Maps API Key in Client/index.html (You can obtain this from https://developers.google.com/maps/documentation/javascript/get-api-key)
* Run ```npm install``` within the 'Server' folder
* Run ```npm start``` in the 'Server' folder.
* Visit http://localhost:3000/ in the browser!
