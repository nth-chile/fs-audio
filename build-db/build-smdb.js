// This builds the database in a forgiving way that pulls in as much as possible, setting things to undefined when not available. Db still should be improved by other scripts, like pulling dates out of titles.

var ENTRIES = [
  "GeorgeClintoAndTheP-FunkAllstars",
  "georgeclinton",
  "GeorgeClintonAndAndPFunk",
  "GeorgeClintonAndParliament",
  "GeorgeClintonAndParliamentFunkadelic",
  "GeorgeClintonAndParliament-Funkadelic",
  "GeorgeClintonAndParliment",
  "GeorgeClintonAndParlimentFunkadelic",
  "GeorgeClintonAndParlimentFunkadelics",
  "GeorgeClintonAndPFunk",
  "GeorgeClintonAndP-Funk",
  "GeorgeClintonAndTheParliamentFunkadelic",
  "GeorgeClintonAndTheParliamentFunkadelicAllStars",
  "GeorgeClintonAndThePFunkAllstars",
  "GeorgeClintonAndTheP-FunkAllstars",
  "GeorgeClintonAndTheP-FunkAll-Stars",
  "GeorgeClintonAndThePFunkAllStars4",
  "GeorgeClintonParliament",
  "GeorgeClintonParliamentFunkadelic",
  "GeorgeClintonParliamentFunkadelicAndTheFamilyStone",
  "GeorgeClintonParlimentFunkadelic",
  "GeorgeClintonP-FunkAllstars",
  "funkadelic",
  "Parliament",
  "ParliamentFunkadelic",
  "parlimentfunkadelic"
]
const COLLECTION = 'george-clinton'
var counta = 0

var ENTRY = ENTRIES[counta]


const https = require("https")
const fs = require("fs")
require('dotenv').config()

let getRequests = 0
let identifiers
let SOURCES = []
let FROM = 0

// BobDylan items: 1853
//let TO =

function start() {
  SOURCES = []
  getRequests = 0

  fs.readFile(`./identifiers/identifiers_${ENTRY}.js`,
    function (err, data) {
      if (err) return console.log(err)

      identifiers = JSON.parse(data.toString())
      identifiers = identifiers.identifiers

      TO = identifiers.length - 1

      return buildGdFromGdCollection(FROM, TO)
    })
}
start();

function buildGdFromGdCollection(start, end) {
	var results = [];

	(function buildResultsWithMp3(start, end) {
		//GET metadata of gdCollection array items from start index to end (inclusive)
		//then call a function that builds the necessary JSON and appends to Array gd
		for (var i = start; i <= end; i++) {
			if ( identifiers[i] != undefined)
				var uri = 'https://archive.org/metadata/' + identifiers[i]
			else {
				console.log('index not found. finished.');
				break;
			}

			function endsWithMp3(element) {
        return element.name.match(/\.mp3$/);
			}

			https.get(uri, function(res) {
				res.setEncoding("utf8");
				let body = "";

				res.on("data", data => {
					body += data;
				});

				res.on("end", () => {
					body = JSON.parse(body);
					results.push(body);
					if ( getRequests++ == end - start ) {
						return handleResults();
					}
				})
			}) //HTTPS.GET
		}
  })(start, end);

 	function handleResults() {
    var counter = results.length;
	 	results.forEach(addSourceToSOURCES);

	 	function addSourceToSOURCES(element, index, array) {
	 		try {
        // date stuff
        let date, day, month, year;

	 			if (element.metadata && element.metadata.date) {
	 				let dateStr = element.metadata.date;
	 				const dateStrMatches = dateStr.match(/(\d{2,4})-(\d{1,2})-(\d{1,2})/);

	 				if(dateStrMatches) {
	 					//set year
	 					if (dateStrMatches[1].length == 2)
	 						year = '19' + dateStrMatches[1];
	 					else if (dateStrMatches[1].length == 4)
	 						year = dateStrMatches[1];
	 					else
	 						throw 'weird dateStr:' + dateStr;

	 					//set month
	 					if (dateStrMatches[2].length == 1)
	 						month = '0' + dateStrMatches[2];
	 					else if (dateStrMatches[2].length == 2)
	 						month = dateStrMatches[2];
	 					else
	 						throw 'weird dateStr:' + dateStr;

	 					//set day
	 					if (dateStrMatches[3].length == 1)
	 						day = '0' + dateStrMatches[3];
	 					else if (dateStrMatches[3].length == 2)
	 						day = dateStrMatches[3];
	 					else
	 						throw 'weird dateStr:' + dateStr;

	 					//set date
	 					date = new Date(`<${year}-${month}-${day}>`);
	 				}

	 				else date = dateStr;
        }

 				//get mp3s from source
 				let tracks = element.files ? element.files.filter(file => file.name.slice(-4) === '.mp3' || '.wma' || '.ogg' ) : []

 				//build array of track objects
 				let tracksObjs = tracks.map(function(track, index, array) {
 					return {
 						duration: track.length || undefined,
 						title: track.title || undefined,
 						track: track.track || undefined,
 						uri: track.name || undefined,
 					};
 				});

 				//build source obj
 				let sourceObj = {
 					date: date || undefined,
 					dir: element.dir || undefined,
 					tracks: tracksObjs,
 					server: element.server || undefined,
 					subject: element.metadata && element.metadata.subject || undefined,
 					title: element.metadata && element.metadata.title || undefined,
 					venue: element.metadata && element.metadata.venue || undefined,
 				};

 				//push source
 				SOURCES.push(sourceObj);

 				if (--counter == 0) {
 					console.log('bout 2 do');
 					return insertGdIntoDB();
 				}
	 		}

	 		catch (e) {
	 			console.log(e);
	 		}

		};
	}
 }

function insertGdIntoDB() {
	var MongoClient = require('mongodb').MongoClient;

	MongoClient.connect(process.env.DB_URI, function(err, client) {
    let db = client.db('smdb')
	  db.collection(COLLECTION).insertMany(SOURCES)
		.then(function(result) {
			console.log(result);
      client.close();

      if (ENTRIES[counta + 1]) {
        ENTRY = ENTRIES[++counta];

        console.log(`
        ###################\n
        #### GOING AGAIN ##\n
        ###################
        `);

        return start()
      }
		})
    .catch((err) => {
      console.log(err, ENTRY)
      client.close();
    });
	});
}
