# CalendarWebApp

Calendar web app the excludes weekends; Built specifically for J&B Drafting.

Ideally viewed and edited in Chrome, using a 1080p display. Anything else is not guaranteed to display or function as intended.

Stream it to a 1080p display through a Chromecast or a Raspberry Pi!

Currently only runs offline on your local area network.

Installation instructions:

1. Make sure you have NodeJS installed.

2. Either clone the source code or download the .zip file from Github

3. On windows, run RunServer.bat, on Mac/Linux, run "node server.js" from the app folder

4. In a browser, go to either localhost or your LAN IP address

5. Connect more computers/displays/etc. by typing in the local IP address of the computer running it, and add ":3000" to the end, ex. 192.168.0.49:3000

v1.0 release!

More than likely still chock full of bugs and missing functionality ¯\\\_(ツ)\_/¯

Built using several frameworks and packages including:

- [NodeJS](https://nodejs.org/)

- [Materialize CSS](http://materializecss.com/)

- [DiskDB](https://github.com/arvindr21/diskDB)

- [Moment.js](http://momentjs.com/)

- [jQuery](https://jquery.com/)

- [Socket.IO](http://socket.io/)

- [Express.js](https://expressjs.com/)
