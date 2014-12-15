var request = require('request');
var diff = require('diff');
var smart = require('./smart');
var fs = require('fs');
var moment = require('moment');
var url = 'https://www.smartcitizen.me/devices/all.geojson';

var timestamp = moment().unix();

var tmpDir = __dirname + '/tmp/';
var dataDir = __dirname + '/data/';

// Create directories if needed
if (!fs.existsSync(tmpDir))
    fs.mkdirSync(tmpDir)

if (!fs.existsSync(dataDir))
    fs.mkdirSync(dataDir)

var currentFileName = timestamp + '.json';

var writeStream = fs.createWriteStream(tmpDir + currentFileName);

var logTimestamp = function () {
    return '[' + moment().toISOString() + ']';
};

writeStream.on('finish', function () {
    var currentTmp = require(tmpDir + currentFileName);

    // Compare contents to previous
    fs.readdir(dataDir, function (error, files) {
        var current = smart.format(currentTmp);
        current.timestamp = moment().unix();

        // Make sure we only include json files
        files = files.filter(function (fileName) {
            return fileName != '.DS_Store' && fileName != currentFileName;
        });

        if (files.length > 0) {

            // Sort by timestamp
            files.sort(function (a, b) {
                return parseInt(a.split('.')[0])
                     - parseInt(b.split('.')[0]);
            });

            var previous = require(dataDir + files[files.length - 1]);

            if (JSON.stringify(current.data) == JSON.stringify(previous.data)) {
                console.log(logTimestamp(), 'Output is same as previous');
                return;
            }
        }

        fs.writeFile(dataDir + currentFileName, JSON.stringify(current));

        console.log(logTimestamp(), 'Written data to ' + currentFileName);

        // Delete the tmp file
        fs.unlink(tmpDir + currentFileName);
    });
});

request
    .get(url, function (error, response, body) {
        if (error || response.statusCode != 200) {
            console.error(logTimestamp(), "Couldn't retrieve devices");
            console.error(logTimestamp(), error);
            return;
        }
    })
    .pipe(writeStream);