const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('http');
const moment = require('moment');
const PORT = process.env.PORT || 3000;

var _ = require('lodash');

const apiKey = '58eb4c7e5dca66f6c0c42cb1a7d56640';

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.set('view engine', 'ejs');

app.locals._ = _;

app.get('/', function (req, res) {

    request.get('http://api.openweathermap.org/data/2.5/forecast?q=Lebanon,usa&units=imperial&appid=58eb4c7e5dca66f6c0c42cb1a7d56640', (resp) => {
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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});