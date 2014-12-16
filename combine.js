var smart = require('./lib/smart');
var fs = require('fs');

var tmpDir = __dirname + '/tmp/';
var dataDir = __dirname + '/data/';

fs.readdir(dataDir, function (error, files) {
    // Make sure we only include json files
    files = files.filter(function (fileName) {
        return fileName != '.DS_Store';
    });

    var data = smart.combine(dataDir, files);

    fs.writeFileSync(__dirname + '/data.json', JSON.stringify(data));
});
