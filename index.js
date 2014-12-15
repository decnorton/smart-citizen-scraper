var request = require('request');
var diff = require('diff');
var smart = require('./smart');
var fs = require('fs');
var moment = require('moment');
var url = 'https://www.smartcitizen.me/devices/all.geojson';

var timestamp = moment().unix();

var rawDir = './raw/';
var dataDir = './data/';

var currentFileName = timestamp + '.json';

var writeStream = fs.createWriteStream(rawDir + currentFileName);

writeStream.on('finish', function () {
    var currentRaw = require(rawDir + currentFileName);

    console.log('test');

    // Compare contents to previous
    fs.readdir(dataDir, function (error, files) {
        var current = smart.format(currentRaw);
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

            console.log(files);

            var previous = require(dataDir + files[files.length - 1]);

            if (JSON.stringify(current.data) == JSON.stringify(previous.data)) {
                console.log('Output is same as previous');
                return;
            }
        }

        fs.writeFile(dataDir + currentFileName, JSON.stringify(current));

        console.log('Written to ' + currentFileName);

        // Delete the raw file
        fs.unlink(rawDir + currentFileName);
    });
});

request
    .get(url, function (error, response, body) {
        if (error || response.statusCode != 200) {
            console.error("Couldn't retrieve devices");
            console.error(error);
            return;
        }

        console.log('boobs');
    })
    .pipe(writeStream)
    .on('response', function (response) {
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
    });