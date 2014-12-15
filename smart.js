module.exports = new (function () {

    this.format = function (data) {
        var out = [];

        var withSolar = 0;
        var withLight = 0;

        var sensors = [
            'temp',
            'hum',
            'co',
            'no2',
            'light',
            'noise',
            'bat',
            'panel',
            'nets',
        ];

        var sensorData = {};

        for (var i in sensors) {
            sensorData[sensors[i]] = {
                min: null,
                max: null,
                count: 0,
                sum: 0
            };
        }

        for (var i in data.features) {
            var device = data.features[i].properties;

            if (device.status != 'online')
                continue;

            if (device.feeds && device.feeds[0]) {
                var feed = device.feeds[0];

                for (var sensor in feed) {
                    var value = feed[sensor];

                    if (value == 0) {
                        continue;
                    }

                    if (sensorData[sensor]) {

                        sensorData[sensor].count++;
                        sensorData[sensor].sum += value;

                        if (sensorData[sensor].min == null
                            || sensorData[sensor].min > value
                        ) {
                            sensorData[sensor].min = value;
                        }

                        if (sensorData[sensor].max == null
                            || sensorData[sensor].max < value
                        ) {
                            sensorData[sensor].max = value;
                        }
                    }
                }
            }

            out.push(device);
        }

        console.log(out.length + ' devices');

        for (var i in sensorData) {
            var obj = sensorData[i];
            obj.sum = Math.round(obj.sum * 100) / 100;
            obj.average = Math.round((obj.sum / obj.count) * 100) / 100;
        }

        return {
            data: {
                devices: out.length,
                sensors: sensorData
            }
        };
    }
})();