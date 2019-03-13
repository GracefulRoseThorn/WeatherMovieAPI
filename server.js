const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('http');
const moment = require('moment');

var _ = require('lodash');

const apiKey = '8ba9df0e58c48ceb3271a1edd37e94a0';

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.set('view engine', 'ejs');

app.locals._ = _;

app.get('/', function (req, res) {

    request.get('http://api.openweathermap.org/data/2.5/forecast?q=London,uk&units=metric&appid=8ba9df0e58c48ceb3271a1edd37e94a0', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var finalData = JSON.parse(data);
            var today = {};
            var days = {};
            var count = 0;
            var total = finalData.list.length;
            _.forEach(finalData.list, function (val, key) {
                const day = moment(val.dt * 1000).format("dddd Do MMMM");

                if(count == 0){
                    today[day] = {};
                    today[day] = {
                        temp: val.main.temp,
                        humidity: val.main.humidity,
                        wind: val.wind.speed,
                        icon: val.weather[0].icon,
                        type: val.weather[0].main
                    };    
                } else {
                    if (!_.has(days, day)) days[day] = {};
                    days[day] = {
                        temp: val.main.temp,
                        humidity: val.main.humidity,
                        wind: val.wind.speed,
                        icon: val.weather[0].icon,
                        type: val.weather[0].main
                    };
                }
                count++;
                if (count === total) {
                    res.render('index', {
                        today: today,
                        data: days
                    });
                }
            });


        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

app.listen(4200, function () {
    console.log('Example app listening on port 4200!');
});