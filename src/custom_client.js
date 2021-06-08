const Commando = require('discord.js-commando');
const https = require('https');
const http = require('http');
const axios = require('axios');
const messages = require('./objects/messages.json');
const stream = messages.stream;

class Client extends Commando.CommandoClient {

	constructor(options = {}) {
		super(options);

		this.reactions_map = new Map();
		this.reactions_map.set("emo", false);

		this.getQuotes();
		
	    this.music = {};

	    this.stream_status = null;
	    this.stream_timer = null;

	    this.moon = null;
	    
	    this.once('ready', () => {
	    	this.stream_timer = setInterval(this.checkStream, 30000, this);
	    	this.checkMoon();
	    })
	}

	async checkStream(handler, offline) {
	    // https.get('https://api.picarto.tv/v1/channel/name/REDnFLYNN', res => {
	    //     const { statusCode } = res;
	    //     const contentType = res.headers['content-type'];

	    //     let error;
	    //     if (statusCode !== 200) {
	    //         error = new Error('Picarto API: Request Failed.\n' +
	    //         `Status Code: ${statusCode}`);
	    //     } else if (!/^application\/json/.test(contentType)) {
	    //         error = new Error('Picarto API: Invalid content-type.\n' +
	    //         `Expected application/json but received ${contentType}`);
	    //     }
	    //     if (error) {
	    //         console.error("Error with stream GET request: " + error.message);
	    //         // consume response data to free up memory
	    //         res.resume();
	    //         return;
	    //     }

	    //     res.setEncoding('utf8');
	    //     let rawData = '';
	    //     res.on('data', (chunk) => { rawData += chunk; });
	    //     res.on('end', () => {
	    //         try {
	    //             const rnf = JSON.parse(rawData);
	    //             if (handler.stream_status === null) {
	    //                 handler.stream_status = rnf.online;
	    //                 console.log("Stream status initialized as " + handler.stream_status);
	    //                 return;
	    //             }
	    //             if (offline) {
	    //                 handler.stream_status = rnf.online;
	    //                 handler.stream_timer = setInterval(handler.checkStream, 30000);
	    //                 if (!rnf.online) console.log("Stream is off");
	    //                 return;
	    //             }
	    //             if (handler.stream_status === rnf.online) return;
	    //             if (rnf.online) {
	    //                 handler.stream_status = true;
	    //                 handler.guilds.cache.get(process.env.SHILOH_SERVER_ID)
	    //                     .channels.cache.get(process.env.SHILOH_CHANNEL_GENERAL)
	    //                     .send(`${stream[Math.floor(Math.random() * stream.length)]} https://picarto.tv/REDnFLYNN`);
	    //                 return;
	    //             }
	    //             clearInterval(handler.stream_timer);
	    //             //console.log("CheckStream function");
	    //             //console.log(handler.checkStream);
	    //             setTimeout(handler.checkStream, 300000, true);
	    //         } catch (e) {
	    //             console.error("Error while parsing stream JSON: " + e.message);
	    //         }
	    //     });
	    // }).on('error', (e) => {
	    //     console.error(`Error with stream GET response: ${e.message}`);
		// });
		try {
			const answer = await axios.get('https://api.picarto.tv/v1/channel/name/REDnFLYNN');
			const rnf = answer.data;
			// console.log(rnf);
            if (handler.stream_status === null) {
				handler.stream_status = rnf.online;
				console.log("Stream status initialized as " + handler.stream_status);
				return;
			}
			if (offline) {
				handler.stream_status = rnf.online;
				handler.stream_timer = setInterval(handler.checkStream, 30000);
				if (!rnf.online) console.log("Stream is off");
				return;
			}
			if (handler.stream_status === rnf.online) return;
			if (rnf.online) {
				handler.stream_status = true;
				handler.guilds.cache.get(process.env.SHILOH_SERVER_ID)
					.channels.cache.get(process.env.SHILOH_CHANNEL_GENERAL)
					.send(`${stream[Math.floor(Math.random() * stream.length)]} https://picarto.tv/REDnFLYNN`);
				return;
				// TODO change bot status to watching red and flynn
			}
			clearInterval(handler.stream_timer);
			//console.log("CheckStream function");
			//console.log(handler.checkStream);
			setTimeout(handler.checkStream, 300000, true);
        } catch (e) {
			console.error(`Error with Picarto API: ${e.message}`);
			// console.error(e);
        }
	}

	async checkMoon() {
		try {
			const answer = await axios.get('http://isitfullmoon.com/api.php?format=json');
			const isitfullmoon = answer.data.isitfullmoon;
            this.moon = {
				isFull: isitfullmoon.status === "Yes",
				nextFullMoon: new Date(isitfullmoon.next * 1000)
			};
			console.log("Full moon variable initialized as " + this.moon.isFull);
        } catch (e) {
			console.error(`Error with check moon function: ${e.message}`);
			// console.error(e);
        }
	}

	getQuotes() {
	    // let options = {
	    //     hostname: 'api.jsonbin.io',
	    //     path: '/b/' + process.env.TOKEN_QUOTES_ID + '/latest',
	    //     headers: {
	    //         'secret-key': process.env.TOKEN_QUOTES_PASSWORD
	    //     }
	    // };

	    // https.get(options, res => {
	    //     const { statusCode } = res;
	    //     const contentType = res.headers['content-type'];

	    //     let error;
	    //     if (statusCode !== 200) {
	    //         error = new Error('JSONbin API: Request Failed.\n' +
	    //         `Status Code: ${statusCode}`);
	    //     } else if (!/^application\/json/.test(contentType)) {
	    //         error = new Error('JSONbin API: Invalid content-type.\n' +
	    //         `Expected application/json but received ${contentType}`);
	    //     }
	    //     if (error) {
	    //         console.error("Error with JSONbin GET request: " + error.message);
	    //         // consume response data to free up memory
	    //         res.resume();
	    //         this.quotes_array = null;
	    //         return;
	    //     }

	    //     res.setEncoding('utf8');
	    //     let rawData = '';
	    //     res.on('data', (chunk) => { rawData += chunk; });
	    //     res.on('end', () => {
	    //         try {
	    //             const parsedData = JSON.parse(rawData);
	    //             this.quotes_array = parsedData;
	    //             console.log("Quotes initialized!");
	    //         } catch (e) {
	    //             console.error("Error while parsing stream JSON: " + e.message);
	    //             this.quotes_array = null;
	    //         }
	    //     });
	    // }).on('error', (e) => {
	    //     console.error(`Error with stream GET response: ${e.message}`);
	    //     this.quotes_array = null;
	    // });
	}

}

module.exports = Client;